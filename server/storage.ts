import {
  type User,
  type InsertUser,
  type Quote,
  type InsertQuote,
  type Contact,
  type InsertContact,
  type QuoteWorkflow,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<Quote | undefined>;
  updateQuote(id: string, update: Partial<Quote>): Promise<Quote | undefined>;

  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotes: Map<string, Quote>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.contacts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const baseWorkflow: QuoteWorkflow = {
      ...insertQuote.workflow,
      statusHistory: insertQuote.workflow.statusHistory?.length
        ? insertQuote.workflow.statusHistory
        : [
            {
              status: insertQuote.status || "pending",
              changedAt: new Date().toISOString(),
              note: "Quote created",
            },
          ],
    };
    const quote: Quote = {
      ...insertQuote,
      id,
      status: insertQuote.status || "pending",
      customerEmail: insertQuote.customerEmail || null,
      customerName: insertQuote.customerName || null,
      customerPhone: insertQuote.customerPhone || null,
      createdAt: new Date(),
      workflow: baseWorkflow,
      reviewEmailSent: insertQuote.reviewEmailSent ?? false,
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateQuoteStatus(id: string, status: string): Promise<Quote | undefined> {
    return this.updateQuote(id, {
      status,
      workflow: {
        ...(this.quotes.get(id)?.workflow ?? {
          statusHistory: [],
          carrier: "UNLOCKED",
          lockStatus: "unlocked",
          shippingMethod: "email-label",
          shippingKitFee: 0,
          payoutAmount: 0,
          totalDue: 0,
          trustpilotEligible: true,
          shippingInfo: {
            name: "",
            email: "",
            phone: "",
            address1: "",
            city: "",
            state: "",
            postalCode: "",
          },
        }),
        statusHistory: [
          ...((this.quotes.get(id)?.workflow.statusHistory) ?? []),
          {
            status,
            changedAt: new Date().toISOString(),
            note: "Status updated",
          },
        ],
      },
    });
  }

  async updateQuote(id: string, update: Partial<Quote>): Promise<Quote | undefined> {
    const quote = this.quotes.get(id);
    if (!quote) return undefined;

    const mergedWorkflow = update.workflow
      ? {
          ...quote.workflow,
          ...update.workflow,
          shippingInfo: update.workflow.shippingInfo ?? quote.workflow.shippingInfo,
          statusHistory:
            update.workflow.statusHistory ?? quote.workflow.statusHistory,
          kitLabels: {
            ...quote.workflow.kitLabels,
            ...update.workflow.kitLabels,
          },
          reminders: update.workflow.reminders ?? quote.workflow.reminders,
          devicePhotos: update.workflow.devicePhotos ?? quote.workflow.devicePhotos,
        }
      : quote.workflow;

    const updatedQuote: Quote = {
      ...quote,
      ...update,
      workflow: mergedWorkflow,
    };

    if (update.status && !update.workflow?.statusHistory) {
      updatedQuote.workflow = {
        ...updatedQuote.workflow,
        statusHistory: [
          ...updatedQuote.workflow.statusHistory,
          {
            status: update.status,
            changedAt: new Date().toISOString(),
            note: "Status updated",
          },
        ],
      };
    }

    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
