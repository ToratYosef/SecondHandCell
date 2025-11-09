import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertQuoteSchema,
  insertContactSchema,
  updateQuoteSchema,
  insertSupportSessionSchema,
  supportMessageSchema,
  supportTypingSchema,
  updateSupportSessionSchema,
  supportReadSchema,
  labelActionSchema,
  quoteEmailSchema,
  type LabelActionKind,
} from "@shared/schema";
import { createShippingLabel, labelToWorkflow } from "./shipengine";
import {
  buildCancellationEmail,
  buildEmailLabelMessage,
  buildReminderEmail,
  buildRequoteEmail,
  buildReturnLabelMessage,
  buildTrustpilotEmail,
} from "./email-templates";
import { isEmailConfigured, sendMail } from "./smtp";
import type { Quote, QuoteWorkflow, WorkflowLabel } from "@shared/schema";

function resolveCustomerEmail(quote: Quote): string | undefined {
  return quote.customerEmail ?? quote.workflow.shippingInfo.email;
}

function appendHistory(quote: Quote, status: string, note?: string) {
  return [
    ...quote.workflow.statusHistory,
    {
      status,
      changedAt: new Date().toISOString(),
      note,
    },
  ];
}

function defaultLabelNote(kind: LabelActionKind) {
  switch (kind) {
    case "email_label":
      return "Label emailed to customer";
    case "kit_outbound":
      return "Outbound kit label generated";
    case "kit_inbound":
      return "Inbound kit label generated";
    case "return_label":
      return "Return label created";
    default:
      return "Label update";
  }
}

function mergeKitLabels(existing: QuoteWorkflow["kitLabels"], label: WorkflowLabel, direction: "outbound" | "inbound") {
  return {
    ...(existing ?? {}),
    [direction]: label,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/quotes", async (req, res) => {
    try {
      const email = typeof req.query.email === "string" ? req.query.email : undefined;
      if (email) {
        const quotes = await storage.getQuotesByEmail(email);
        return res.json(quotes);
      }

      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json(quote);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/quotes/:id", async (req, res) => {
    try {
      const validatedData = updateQuoteSchema.parse(req.body);
      const updatedQuote = await storage.updateQuote(req.params.id, validatedData);
      if (!updatedQuote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json(updatedQuote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/support/sessions", async (_req, res) => {
    try {
      const sessions = await storage.listSupportSessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/support/sessions", async (req, res) => {
    try {
      const payload = insertSupportSessionSchema.parse(req.body);
      const session = await storage.createSupportSession(payload);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/support/sessions/:id", async (req, res) => {
    try {
      const detail = await storage.getSupportSession(req.params.id);
      if (!detail) {
        return res.status(404).json({ error: "Support session not found" });
      }
      res.json(detail);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/support/sessions/:id", async (req, res) => {
    try {
      const payload = updateSupportSessionSchema.parse(req.body);
      const updated = await storage.updateSupportSession(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: "Support session not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/support/sessions/:id/messages", async (req, res) => {
    try {
      const payload = supportMessageSchema.parse(req.body);
      const updated = await storage.addSupportMessage(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: "Support session not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/support/sessions/:id/typing", async (req, res) => {
    try {
      const payload = supportTypingSchema.parse(req.body);
      const updated = await storage.updateSupportTyping(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: "Support session not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/support/sessions/:id/read", async (req, res) => {
    try {
      const payload = supportReadSchema.parse(req.body);
      const updated = await storage.markSupportMessagesRead(req.params.id, payload.role);
      if (!updated) {
        return res.status(404).json({ error: "Support session not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/quotes/:id/labels", async (req, res) => {
    try {
      const payload = labelActionSchema.parse(req.body);
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }

      const labelResult = await createShippingLabel(quote, payload.kind);
      const workflowLabel = labelToWorkflow(labelResult, payload.notes);

      const workflowUpdates: Partial<QuoteWorkflow> = {
        adminNotes: payload.adminNotes ?? quote.workflow.adminNotes,
      };

      let nextStatus = quote.status;
      let historyStatus = quote.status;
      const historyNote = payload.notes ?? defaultLabelNote(payload.kind);

      if (payload.kind === "kit_outbound") {
        workflowUpdates.kitLabels = mergeKitLabels(quote.workflow.kitLabels, workflowLabel, "outbound");
        historyStatus = "kit_prepared";
        nextStatus = "kit_prepared";
      } else if (payload.kind === "kit_inbound") {
        workflowUpdates.kitLabels = mergeKitLabels(quote.workflow.kitLabels, workflowLabel, "inbound");
        historyStatus = "kit_prepared";
        nextStatus = quote.status === "pending" ? "kit_prepared" : quote.status;
      } else if (payload.kind === "email_label") {
        workflowUpdates.kitLabels = mergeKitLabels(quote.workflow.kitLabels, workflowLabel, "inbound");
        historyStatus = "label_sent";
        nextStatus = "label_sent";
      } else if (payload.kind === "return_label") {
        workflowUpdates.returnLabel = workflowLabel;
        workflowUpdates.trustpilotEligible = false;
        historyStatus = "return_initiated";
        nextStatus = "return_initiated";
      }

      workflowUpdates.statusHistory = appendHistory(quote, historyStatus, historyNote);

      const updatePayload: Partial<Omit<Quote, "workflow">> & { workflow?: Partial<QuoteWorkflow> } = {
        workflow: workflowUpdates,
      };
      if (nextStatus !== quote.status) {
        updatePayload.status = nextStatus;
      }
      if (payload.kind === "return_label") {
        updatePayload.reviewEmailSent = false;
      }

      const updatedQuote = await storage.updateQuote(quote.id, updatePayload);
      if (!updatedQuote) {
        throw new Error("Failed to update quote with label metadata");
      }

      if (payload.sendEmail) {
        if (!isEmailConfigured()) {
          return res.status(500).json({ error: "Email configuration is missing" });
        }
        const customerEmail = resolveCustomerEmail(updatedQuote);
        if (!customerEmail) {
          return res.status(400).json({ error: "Customer email unavailable" });
        }

        try {
          if (payload.kind === "return_label") {
            const returnLabel = updatedQuote.workflow.returnLabel;
            if (!returnLabel) {
              throw new Error("Return label missing");
            }
            const message = buildReturnLabelMessage(updatedQuote, returnLabel);
            await sendMail({ to: customerEmail, ...message });
          } else {
            const inboundLabel = updatedQuote.workflow.kitLabels?.inbound;
            if (!inboundLabel) {
              throw new Error("Inbound label missing for notification");
            }
            const outboundLabel = updatedQuote.workflow.kitLabels?.outbound;
            const message = buildEmailLabelMessage(updatedQuote, inboundLabel, outboundLabel, payload.notes);
            await sendMail({ to: customerEmail, ...message });
          }
        } catch (error: any) {
          return res.status(500).json({ error: error.message ?? "Unable to send label email" });
        }
      }

      res.json({ quote: updatedQuote, label: workflowLabel });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message ?? "Unable to generate label" });
    }
  });

  app.post("/api/quotes/:id/emails", async (req, res) => {
    try {
      const payload = quoteEmailSchema.parse(req.body);
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }

      if (!isEmailConfigured()) {
        return res.status(500).json({ error: "Email configuration is missing" });
      }

      const customerEmail = resolveCustomerEmail(quote);
      if (!customerEmail) {
        return res.status(400).json({ error: "Customer email unavailable" });
      }

      let message;
      switch (payload.template) {
        case "trustpilot":
          message = buildTrustpilotEmail(quote);
          break;
        case "requote": {
          const amount = payload.requoteAmount ?? quote.workflow.payoutAmount ?? quote.price;
          message = buildRequoteEmail(quote, amount);
          break;
        }
        case "reminder": {
          if (!payload.reminderType) {
            return res.status(400).json({ error: "Reminder type is required" });
          }
          message = buildReminderEmail(quote, payload.reminderType);
          break;
        }
        case "cancel":
          message = buildCancellationEmail(quote);
          break;
        default:
          return res.status(400).json({ error: "Unsupported template" });
      }

      if (payload.notes) {
        message = {
          ...message,
          html: message.html.replace(
            "</div>",
            `<p style="margin:16px 0;">${payload.notes}</p></div>`
          ),
          text: `${message.text}\n\n${payload.notes}`,
        };
      }

      await sendMail({ to: customerEmail, ...message });

      if (payload.adminNotes) {
        await storage.updateQuote(quote.id, {
          workflow: {
            ...quote.workflow,
            adminNotes: payload.adminNotes,
          },
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message ?? "Unable to send email" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
