import {
  type User,
  type InsertUser,
  type Quote,
  type InsertQuote,
  type Contact,
  type InsertContact,
  type QuoteWorkflow,
  type SupportSession,
  type SupportSessionDetail,
  type InsertSupportSession,
  type InsertSupportMessage,
  type SupportRole,
  type SupportMessage,
  type SupportTypingUpdate,
  type UpdateSupportSession,
  type SupportSessionStatus,
  type SupportPriority,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  getQuotesByEmail(email: string): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<Quote | undefined>;
  updateQuote(id: string, update: Partial<Quote>): Promise<Quote | undefined>;

  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  createSupportSession(payload: InsertSupportSession): Promise<SupportSessionDetail>;
  listSupportSessions(): Promise<SupportSession[]>;
  getSupportSession(id: string): Promise<SupportSessionDetail | undefined>;
  addSupportMessage(sessionId: string, message: InsertSupportMessage): Promise<SupportSessionDetail | undefined>;
  updateSupportTyping(sessionId: string, update: SupportTypingUpdate): Promise<SupportSession | undefined>;
  updateSupportSession(id: string, update: UpdateSupportSession): Promise<SupportSessionDetail | undefined>;
  markSupportMessagesRead(sessionId: string, role: SupportRole): Promise<SupportSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotes: Map<string, Quote>;
  private contacts: Map<string, Contact>;
  private supportSessions: Map<string, SupportSessionRecord>;
  private supportMessages: Map<string, SupportMessageRecord[]>;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.contacts = new Map();
    this.supportSessions = new Map();
    this.supportMessages = new Map();
  }

  private serializeSession(record: SupportSessionRecord): SupportSession {
    return {
      id: record.id,
      customerEmail: record.customerEmail,
      customerName: record.customerName,
      customerPhone: record.customerPhone,
      orderNumber: record.orderNumber,
      associatedQuoteIds: Array.from(record.associatedQuoteIds),
      status: record.status,
      priority: record.priority,
      assignedTo: record.assignedTo,
      createdAt: record.createdAt.toISOString(),
      lastUpdatedAt: record.lastUpdatedAt.toISOString(),
      lastMessageAt: record.lastMessageAt?.toISOString(),
      lastMessagePreview: record.lastMessagePreview,
      unreadForAdmin: record.unreadForAdmin,
      unreadForCustomer: record.unreadForCustomer,
      customerTypingPreview: record.customerTypingPreview,
      adminTypingPreview: record.adminTypingPreview,
    };
  }

  private serializeMessage(message: SupportMessageRecord): SupportMessage {
    return {
      id: message.id,
      sessionId: message.sessionId,
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      read: message.read,
      orderId: message.orderId,
    };
  }

  private buildSessionDetail(record: SupportSessionRecord): SupportSessionDetail {
    const messages = this.supportMessages.get(record.id) ?? [];
    const relatedQuotes = this.getQuotesForSession(record);
    return {
      session: this.serializeSession(record),
      messages: messages.map((message) => this.serializeMessage(message)),
      orders: relatedQuotes,
    };
  }

  private getQuotesForSession(record: SupportSessionRecord): Quote[] {
    const associatedIds = new Set(record.associatedQuoteIds);
    const lowerEmail = record.customerEmail.toLowerCase();
    for (const quote of Array.from(this.quotes.values())) {
      if (!quote.customerEmail) continue;
      if (quote.customerEmail.toLowerCase() === lowerEmail) {
        associatedIds.add(quote.id);
      }
      if (record.orderNumber && quote.orderNumber === record.orderNumber) {
        associatedIds.add(quote.id);
      }
    }

    return Array.from(associatedIds)
      .map((id) => this.quotes.get(id))
      .filter((quote): quote is Quote => Boolean(quote))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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

  async getQuotesByEmail(email: string): Promise<Quote[]> {
    const normalized = email.toLowerCase();
    return Array.from(this.quotes.values())
      .filter((quote) => quote.customerEmail?.toLowerCase() === normalized)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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

  async createSupportSession(payload: InsertSupportSession): Promise<SupportSessionDetail> {
    const now = new Date();
    const trimmedEmail = payload.customerEmail.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();
    const existing = Array.from(this.supportSessions.values()).find((session) => {
      if (session.customerEmail.toLowerCase() !== normalizedEmail) return false;
      if (session.status === "closed") return false;
      if (!payload.orderNumber) return true;
      return session.orderNumber === payload.orderNumber;
    });

    const matchedQuote = payload.contextQuoteId
      ? this.quotes.get(payload.contextQuoteId)
      : Array.from(this.quotes.values()).find((quote) => {
          if (!quote.customerEmail) return false;
          if (quote.customerEmail.toLowerCase() !== normalizedEmail) return false;
          if (payload.orderNumber && quote.orderNumber !== payload.orderNumber) {
            return false;
          }
          return true;
        });

    if (existing) {
      if (payload.customerName) existing.customerName = payload.customerName;
      if (payload.customerPhone) existing.customerPhone = payload.customerPhone;
      if (payload.orderNumber) existing.orderNumber = payload.orderNumber;
      existing.customerEmail = trimmedEmail;
      if (matchedQuote) {
        existing.associatedQuoteIds.add(matchedQuote.id);
      }
      const relatedByEmail = await this.getQuotesByEmail(normalizedEmail);
      relatedByEmail.forEach((quote) => existing.associatedQuoteIds.add(quote.id));
      existing.lastUpdatedAt = now;
      this.supportSessions.set(existing.id, existing);
      return this.buildSessionDetail(existing);
    }

    const session: SupportSessionRecord = {
      id: randomUUID(),
      customerEmail: trimmedEmail,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      orderNumber: payload.orderNumber,
      associatedQuoteIds: new Set<string>(),
      status: "open",
      priority: "normal",
      assignedTo: undefined,
      createdAt: now,
      lastUpdatedAt: now,
      lastMessageAt: undefined,
      lastMessagePreview: undefined,
      unreadForAdmin: 0,
      unreadForCustomer: 0,
      customerTypingPreview: undefined,
      adminTypingPreview: undefined,
    };

    if (matchedQuote) {
      session.associatedQuoteIds.add(matchedQuote.id);
    }
    const relatedQuotes = await this.getQuotesByEmail(normalizedEmail);
    relatedQuotes.forEach((quote) => session.associatedQuoteIds.add(quote.id));

    this.supportSessions.set(session.id, session);
    this.supportMessages.set(session.id, []);

    return this.buildSessionDetail(session);
  }

  async listSupportSessions(): Promise<SupportSession[]> {
    return Array.from(this.supportSessions.values())
      .sort((a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime())
      .map((record) => this.serializeSession(record));
  }

  async getSupportSession(id: string): Promise<SupportSessionDetail | undefined> {
    const record = this.supportSessions.get(id);
    if (!record) return undefined;
    return this.buildSessionDetail(record);
  }

  async addSupportMessage(
    sessionId: string,
    message: InsertSupportMessage,
  ): Promise<SupportSessionDetail | undefined> {
    const record = this.supportSessions.get(sessionId);
    if (!record) return undefined;

    const messages = this.supportMessages.get(sessionId) ?? [];
    const now = new Date();
    const newMessage: SupportMessageRecord = {
      id: randomUUID(),
      sessionId,
      sender: message.sender,
      content: message.content,
      createdAt: now,
      read: false,
      orderId: message.orderId,
    };

    messages.push(newMessage);
    this.supportMessages.set(sessionId, messages);

    record.lastUpdatedAt = now;
    record.lastMessageAt = now;
    record.lastMessagePreview = message.content.slice(0, 140);

    if (message.sender === "customer") {
      record.unreadForAdmin += 1;
      record.customerTypingPreview = undefined;
      if (record.status === "closed") {
        record.status = "open";
      } else if (record.status === "waiting") {
        record.status = "open";
      }
    } else {
      record.unreadForCustomer += 1;
      record.adminTypingPreview = undefined;
      if (record.status === "open") {
        record.status = "waiting";
      }
    }

    if (message.orderId) {
      record.associatedQuoteIds.add(message.orderId);
    }

    this.supportSessions.set(sessionId, record);
    return this.buildSessionDetail(record);
  }

  async updateSupportTyping(
    sessionId: string,
    update: SupportTypingUpdate,
  ): Promise<SupportSession | undefined> {
    const record = this.supportSessions.get(sessionId);
    if (!record) return undefined;

    const now = new Date();
    const preview = update.preview?.trim();
    if (update.role === "customer") {
      record.customerTypingPreview = preview || undefined;
    } else {
      record.adminTypingPreview = preview || undefined;
    }
    record.lastUpdatedAt = now;
    this.supportSessions.set(sessionId, record);
    return this.serializeSession(record);
  }

  async updateSupportSession(
    id: string,
    update: UpdateSupportSession,
  ): Promise<SupportSessionDetail | undefined> {
    const record = this.supportSessions.get(id);
    if (!record) return undefined;

    if (update.status) {
      record.status = update.status as SupportSessionStatus;
    }
    if (update.priority) {
      record.priority = update.priority as SupportPriority;
    }
    if (typeof update.assignedTo !== "undefined") {
      record.assignedTo = update.assignedTo;
    }
    if (typeof update.customerTypingPreview !== "undefined") {
      const preview = update.customerTypingPreview?.trim();
      record.customerTypingPreview = preview || undefined;
    }
    if (typeof update.adminTypingPreview !== "undefined") {
      const preview = update.adminTypingPreview?.trim();
      record.adminTypingPreview = preview || undefined;
    }
    record.lastUpdatedAt = new Date();
    this.supportSessions.set(id, record);
    return this.buildSessionDetail(record);
  }

  async markSupportMessagesRead(
    sessionId: string,
    role: SupportRole,
  ): Promise<SupportSession | undefined> {
    const record = this.supportSessions.get(sessionId);
    if (!record) return undefined;

    const messages = this.supportMessages.get(sessionId) ?? [];

    for (const message of messages) {
      if (role === "admin" && message.sender === "customer") {
        message.read = true;
      }
      if (role === "customer" && message.sender === "admin") {
        message.read = true;
      }
    }

    if (role === "admin") {
      record.unreadForAdmin = 0;
    } else {
      record.unreadForCustomer = 0;
    }

    record.lastUpdatedAt = new Date();
    this.supportSessions.set(sessionId, record);
    this.supportMessages.set(sessionId, messages);
    return this.serializeSession(record);
  }
}

export const storage = new MemStorage();

type SupportSessionRecord = {
  id: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  orderNumber?: string;
  associatedQuoteIds: Set<string>;
  status: SupportSessionStatus;
  priority: SupportPriority;
  assignedTo?: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  unreadForAdmin: number;
  unreadForCustomer: number;
  customerTypingPreview?: string;
  adminTypingPreview?: string;
};

type SupportMessageRecord = {
  id: string;
  sessionId: string;
  sender: SupportRole;
  content: string;
  createdAt: Date;
  read: boolean;
  orderId?: string;
};
