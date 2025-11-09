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
} from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
