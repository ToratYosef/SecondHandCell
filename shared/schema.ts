import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const deviceBrands = ["iPhone", "Samsung"] as const;
export const deviceConditions = ["Excellent", "Good", "Fair"] as const;
export const deviceLockStatuses = ["locked", "unlocked"] as const;
export const carriers = ["AT&T", "VZW", "TMO", "UNLOCKED"] as const;
export const shippingMethods = ["email-label", "shipping-kit"] as const;

export const supportSessionStatuses = ["open", "waiting", "closed"] as const;
export const supportRoles = ["customer", "admin"] as const;
export const supportPriorities = ["normal", "urgent"] as const;

export type DeviceBrand = typeof deviceBrands[number];
export type DeviceCondition = typeof deviceConditions[number];
export type DeviceLockStatus = typeof deviceLockStatuses[number];
export type Carrier = typeof carriers[number];
export type ShippingMethod = typeof shippingMethods[number];
export type SupportSessionStatus = typeof supportSessionStatuses[number];
export type SupportRole = typeof supportRoles[number];
export type SupportPriority = typeof supportPriorities[number];

export interface SupportMessage {
  id: string;
  sessionId: string;
  sender: SupportRole;
  content: string;
  createdAt: string;
  read: boolean;
  orderId?: string;
}

export interface SupportSession {
  id: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  orderNumber?: string;
  associatedQuoteIds: string[];
  status: SupportSessionStatus;
  priority: SupportPriority;
  assignedTo?: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadForAdmin: number;
  unreadForCustomer: number;
  customerTypingPreview?: string;
  adminTypingPreview?: string;
}

export const insertSupportSessionSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(7).optional(),
  orderNumber: z.string().min(1).optional(),
  contextQuoteId: z.string().optional(),
});

export const supportMessageSchema = z.object({
  sender: z.enum(supportRoles),
  content: z.string().min(1),
  orderId: z.string().optional(),
});

export const supportTypingSchema = z.object({
  role: z.enum(supportRoles),
  preview: z.string().max(500).optional(),
});

export const updateSupportSessionSchema = z.object({
  status: z.enum(supportSessionStatuses).optional(),
  priority: z.enum(supportPriorities).optional(),
  assignedTo: z.string().optional(),
  customerTypingPreview: z.string().optional(),
  adminTypingPreview: z.string().optional(),
});

export const supportReadSchema = z.object({
  role: z.enum(supportRoles),
});

export type InsertSupportSession = z.infer<typeof insertSupportSessionSchema>;
export type InsertSupportMessage = z.infer<typeof supportMessageSchema>;
export type SupportTypingUpdate = z.infer<typeof supportTypingSchema>;
export type UpdateSupportSession = z.infer<typeof updateSupportSessionSchema>;
export type SupportReadPayload = z.infer<typeof supportReadSchema>;

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface WorkflowLabel {
  provider?: string;
  labelId?: string;
  trackingNumber?: string;
  url?: string;
  sentAt?: string;
  notes?: string;
}

export type ReminderStatus = "not_sent" | "seven_day" | "fifteen_day" | "canceled";

export interface QuoteWorkflow {
  carrier: Carrier;
  lockStatus: DeviceLockStatus;
  shippingMethod: ShippingMethod;
  shippingKitFee: number;
  payoutAmount: number;
  totalDue: number;
  trustpilotEligible: boolean;
  reviewEmailSentAt?: string;
  paymentReleasedAt?: string;
  statusHistory: { status: string; changedAt: string; note?: string }[];
  adminNotes?: string;
  shippingInfo: ShippingInfo;
  kitLabels?: {
    outbound?: WorkflowLabel;
    inbound?: WorkflowLabel;
  };
  returnLabel?: WorkflowLabel;
  reminders?: {
    status: ReminderStatus;
    lastSentAt?: string;
  };
  devicePhotos?: string[];
}

const workflowLabelSchema = z.object({
  provider: z.string().min(1).optional(),
  labelId: z.string().min(1).optional(),
  trackingNumber: z.string().min(1).optional(),
  url: z.string().url().optional(),
  sentAt: z.string().min(1).optional(),
  notes: z.string().optional(),
});

const shippingInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2),
  postalCode: z.string().min(3),
});

export const quoteWorkflowSchema = z.object({
  carrier: z.enum(carriers),
  lockStatus: z.enum(deviceLockStatuses),
  shippingMethod: z.enum(shippingMethods),
  shippingKitFee: z.number().nonnegative(),
  payoutAmount: z.number().nonnegative(),
  totalDue: z.number().nonnegative(),
  trustpilotEligible: z.boolean(),
  reviewEmailSentAt: z.string().optional(),
  paymentReleasedAt: z.string().optional(),
  statusHistory: z.array(z.object({
    status: z.string(),
    changedAt: z.string(),
    note: z.string().optional(),
  })).default([]),
  adminNotes: z.string().optional(),
  shippingInfo: shippingInfoSchema,
  kitLabels: z.object({
    outbound: workflowLabelSchema.optional(),
    inbound: workflowLabelSchema.optional(),
  }).optional(),
  returnLabel: workflowLabelSchema.optional(),
  reminders: z.object({
    status: z.enum(["not_sent", "seven_day", "fifteen_day", "canceled"] as const),
    lastSentAt: z.string().optional(),
  }).optional(),
  devicePhotos: z.array(z.string().url()).optional(),
});

export interface DeviceModel {
  id: string;
  brand: DeviceBrand;
  name: string;
  storageOptions: number[];
  basePrice: number;
  year?: number;
}

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  modelId: text("model_id").notNull(),
  modelName: text("model_name").notNull(),
  storage: integer("storage").notNull(),
  condition: text("condition").notNull(),
  price: integer("price").notNull(),
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  orderNumber: text("order_number").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  workflow: jsonb("workflow").$type<QuoteWorkflow>().notNull(),
  reviewEmailSent: boolean("review_email_sent").notNull().default(false),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
}).extend({
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(7).optional(),
  workflow: quoteWorkflowSchema,
  reviewEmailSent: z.boolean().optional(),
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export const updateQuoteSchema = z.object({
  status: z.string().optional(),
  workflow: quoteWorkflowSchema.optional(),
  reviewEmailSent: z.boolean().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(7).optional(),
  price: z.number().nonnegative().optional(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export interface SupportSessionDetail {
  session: SupportSession;
  messages: SupportMessage[];
  orders: Quote[];
}
