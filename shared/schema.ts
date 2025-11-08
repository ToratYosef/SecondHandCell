import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
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

export type DeviceBrand = typeof deviceBrands[number];
export type DeviceCondition = typeof deviceConditions[number];

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
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
}).extend({
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(1).optional(),
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

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
