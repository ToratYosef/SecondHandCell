import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["buyer", "admin", "super_admin"]);
export const companyStatusEnum = pgEnum("company_status", ["pending_review", "approved", "rejected", "suspended"]);
export const companyUserRoleEnum = pgEnum("company_user_role", ["owner", "admin", "buyer"]);
export const conditionGradeEnum = pgEnum("condition_grade", ["A", "B", "C", "D"]);
export const networkLockStatusEnum = pgEnum("network_lock_status", ["unlocked", "locked", "other"]);
export const inventoryStatusEnum = pgEnum("inventory_status", ["in_stock", "reserved", "incoming", "discontinued"]);
export const orderStatusEnum = pgEnum("order_status", ["pending_payment", "payment_review", "processing", "shipped", "completed", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["unpaid", "paid", "partially_paid", "refunded"]);
export const paymentMethodEnum = pgEnum("payment_method", ["card", "wire", "ach", "terms", "other"]);
export const quoteStatusEnum = pgEnum("quote_status", ["draft", "sent", "accepted", "rejected", "expired"]);
export const supportTicketStatusEnum = pgEnum("support_ticket_status", ["open", "in_progress", "closed"]);
export const supportTicketPriorityEnum = pgEnum("support_ticket_priority", ["low", "medium", "high"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("buyer"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").notNull().default(true),
});

export const usersRelations = relations(users, ({ many }) => ({
  companyUsers: many(companyUsers),
  createdOrders: many(orders, { relationName: "orderCreator" }),
  createdQuotes: many(quotes, { relationName: "quoteCreator" }),
  createdSavedLists: many(savedLists),
  supportTickets: many(supportTickets),
  auditLogs: many(auditLogs),
}));

// Companies table
export const companies = pgTable("companies", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  legalName: text("legal_name").notNull(),
  taxId: text("tax_id"),
  resellerCertificateUrl: text("reseller_certificate_url"),
  website: text("website"),
  primaryPhone: text("primary_phone"),
  billingEmail: text("billing_email"),
  status: companyStatusEnum("status").notNull().default("pending_review"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  companyUsers: many(companyUsers),
  carts: many(carts),
  orders: many(orders),
  quotes: many(quotes),
  savedLists: many(savedLists),
  shippingAddresses: many(shippingAddresses),
  billingAddresses: many(billingAddresses),
  supportTickets: many(supportTickets),
}));

// Company Users (join table)
export const companyUsers = pgTable("company_users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  roleInCompany: companyUserRoleEnum("role_in_company").notNull().default("buyer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const companyUsersRelations = relations(companyUsers, ({ one }) => ({
  company: one(companies, {
    fields: [companyUsers.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [companyUsers.userId],
    references: [users.id],
  }),
}));

// Device Categories
export const deviceCategories = pgTable("device_categories", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const deviceCategoriesRelations = relations(deviceCategories, ({ many }) => ({
  deviceModels: many(deviceModels),
}));

// Device Models
export const deviceModels = pgTable("device_models", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  name: text("name").notNull(),
  marketingName: text("marketing_name"),
  sku: text("sku").notNull().unique(),
  slug: text("slug").notNull().unique(),
  categoryId: varchar("category_id", { length: 36 }).notNull().references(() => deviceCategories.id),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const deviceModelsRelations = relations(deviceModels, ({ one, many }) => ({
  category: one(deviceCategories, {
    fields: [deviceModels.categoryId],
    references: [deviceCategories.id],
  }),
  variants: many(deviceVariants),
}));

// Device Variants
export const deviceVariants = pgTable("device_variants", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  deviceModelId: varchar("device_model_id", { length: 36 }).notNull().references(() => deviceModels.id, { onDelete: "cascade" }),
  storage: text("storage").notNull(),
  color: text("color").notNull(),
  networkLockStatus: networkLockStatusEnum("network_lock_status").notNull().default("unlocked"),
  conditionGrade: conditionGradeEnum("condition_grade").notNull(),
  internalCode: text("internal_code"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const deviceVariantsRelations = relations(deviceVariants, ({ one, many }) => ({
  deviceModel: one(deviceModels, {
    fields: [deviceVariants.deviceModelId],
    references: [deviceModels.id],
  }),
  inventoryItems: many(inventoryItems),
  priceTiers: many(priceTiers),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  quoteItems: many(quoteItems),
  savedListItems: many(savedListItems),
}));

// Inventory Items
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  deviceVariantId: varchar("device_variant_id", { length: 36 }).notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  quantityAvailable: integer("quantity_available").notNull().default(0),
  minOrderQuantity: integer("min_order_quantity").notNull().default(1),
  location: text("location"),
  status: inventoryStatusEnum("status").notNull().default("in_stock"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  deviceVariant: one(deviceVariants, {
    fields: [inventoryItems.deviceVariantId],
    references: [deviceVariants.id],
  }),
}));

// Price Tiers
export const priceTiers = pgTable("price_tiers", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  deviceVariantId: varchar("device_variant_id", { length: 36 }).notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  minQuantity: integer("min_quantity").notNull(),
  maxQuantity: integer("max_quantity"),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  effectiveFrom: timestamp("effective_from").notNull().defaultNow(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").notNull().default(true),
});

export const priceTiersRelations = relations(priceTiers, ({ one }) => ({
  deviceVariant: one(deviceVariants, {
    fields: [priceTiers.deviceVariantId],
    references: [deviceVariants.id],
  }),
}));

// Carts
export const carts = pgTable("carts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [carts.companyId],
    references: [companies.id],
  }),
  items: many(cartItems),
}));

// Cart Items
export const cartItems = pgTable("cart_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  cartId: varchar("cart_id", { length: 36 }).notNull().references(() => carts.id, { onDelete: "cascade" }),
  deviceVariantId: varchar("device_variant_id", { length: 36 }).notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPriceSnapshot: decimal("unit_price_snapshot", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  deviceVariant: one(deviceVariants, {
    fields: [cartItems.deviceVariantId],
    references: [deviceVariants.id],
  }),
}));

// Orders
export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id),
  createdByUserId: varchar("created_by_user_id", { length: 36 }).notNull().references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending_payment"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("unpaid"),
  paymentMethod: paymentMethodEnum("payment_method"),
  shippingAddressId: varchar("shipping_address_id", { length: 36 }).references(() => shippingAddresses.id),
  billingAddressId: varchar("billing_address_id", { length: 36 }).references(() => billingAddresses.id),
  notesInternal: text("notes_internal"),
  notesCustomer: text("notes_customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  company: one(companies, {
    fields: [orders.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [orders.createdByUserId],
    references: [users.id],
    relationName: "orderCreator",
  }),
  items: many(orderItems),
  payments: many(payments),
  shipments: many(shipments),
}));

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  deviceVariantId: varchar("device_variant_id", { length: 36 }).notNull().references(() => deviceVariants.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  deviceVariant: one(deviceVariants, {
    fields: [orderItems.deviceVariantId],
    references: [deviceVariants.id],
  }),
}));

// Shipping Addresses
export const shippingAddresses = pgTable("shipping_addresses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id, { onDelete: "cascade" }),
  label: text("label"),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  street1: text("street1").notNull(),
  street2: text("street2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("USA"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const shippingAddressesRelations = relations(shippingAddresses, ({ one }) => ({
  company: one(companies, {
    fields: [shippingAddresses.companyId],
    references: [companies.id],
  }),
}));

// Billing Addresses
export const billingAddresses = pgTable("billing_addresses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id, { onDelete: "cascade" }),
  label: text("label"),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  street1: text("street1").notNull(),
  street2: text("street2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("USA"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const billingAddressesRelations = relations(billingAddresses, ({ one }) => ({
  company: one(companies, {
    fields: [billingAddresses.companyId],
    references: [companies.id],
  }),
}));

// Quotes
export const quotes = pgTable("quotes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: text("quote_number").notNull().unique(),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id),
  createdByUserId: varchar("created_by_user_id", { length: 36 }).notNull().references(() => users.id),
  status: quoteStatusEnum("status").notNull().default("draft"),
  validUntil: timestamp("valid_until"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  shippingEstimate: decimal("shipping_estimate", { precision: 10, scale: 2 }).notNull().default("0"),
  taxEstimate: decimal("tax_estimate", { precision: 10, scale: 2 }).notNull().default("0"),
  totalEstimate: decimal("total_estimate", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, {
    fields: [quotes.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [quotes.createdByUserId],
    references: [users.id],
    relationName: "quoteCreator",
  }),
  items: many(quoteItems),
}));

// Quote Items
export const quoteItems = pgTable("quote_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id", { length: 36 }).notNull().references(() => quotes.id, { onDelete: "cascade" }),
  deviceVariantId: varchar("device_variant_id", { length: 36 }).notNull().references(() => deviceVariants.id),
  quantity: integer("quantity").notNull(),
  proposedUnitPrice: decimal("proposed_unit_price", { precision: 10, scale: 2 }).notNull(),
  lineTotalEstimate: decimal("line_total_estimate", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id],
  }),
  deviceVariant: one(deviceVariants, {
    fields: [quoteItems.deviceVariantId],
    references: [deviceVariants.id],
  }),
}));

// Saved Lists
export const savedLists = pgTable("saved_lists", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdByUserId: varchar("created_by_user_id", { length: 36 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const savedListsRelations = relations(savedLists, ({ one, many }) => ({
  company: one(companies, {
    fields: [savedLists.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [savedLists.createdByUserId],
    references: [users.id],
  }),
  items: many(savedListItems),
}));

// Saved List Items
export const savedListItems = pgTable("saved_list_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  savedListId: varchar("saved_list_id", { length: 36 }).notNull().references(() => savedLists.id, { onDelete: "cascade" }),
  deviceVariantId: varchar("device_variant_id", { length: 36 }).notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  defaultQuantity: integer("default_quantity").notNull().default(1),
});

export const savedListItemsRelations = relations(savedListItems, ({ one }) => ({
  savedList: one(savedLists, {
    fields: [savedListItems.savedListId],
    references: [savedLists.id],
  }),
  deviceVariant: one(deviceVariants, {
    fields: [savedListItems.deviceVariantId],
    references: [deviceVariants.id],
  }),
}));

// Payments
export const payments = pgTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull(),
  method: paymentMethodEnum("method").notNull(),
  processedAt: timestamp("processed_at"),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// Shipments
export const shipments = pgTable("shipments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier").notNull(),
  serviceLevel: text("service_level"),
  trackingNumber: text("tracking_number"),
  shippingLabelUrl: text("shipping_label_url"),
  shippedAt: timestamp("shipped_at"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
});

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
}));

// FAQs
export const faqs = pgTable("faqs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  body: text("body").notNull(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id", { length: 36 }).references(() => companies.id, { onDelete: "cascade" }),
  createdByUserId: varchar("created_by_user_id", { length: 36 }).references(() => users.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: supportTicketStatusEnum("status").notNull().default("open"),
  priority: supportTicketPriorityEnum("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  company: one(companies, {
    fields: [supportTickets.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [supportTickets.createdByUserId],
    references: [users.id],
  }),
}));

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  actorUserId: varchar("actor_user_id", { length: 36 }).references(() => users.id),
  companyId: varchar("company_id", { length: 36 }).references(() => companies.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  previousValues: text("previous_values"),
  newValues: text("new_values"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id],
  }),
}));

// Insert schemas and types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanyUserSchema = createInsertSchema(companyUsers).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceCategorySchema = createInsertSchema(deviceCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeviceModelSchema = createInsertSchema(deviceModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeviceVariantSchema = createInsertSchema(deviceVariants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPriceTierSchema = createInsertSchema(priceTiers).omit({
  id: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertShippingAddressSchema = createInsertSchema(shippingAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBillingAddressSchema = createInsertSchema(billingAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteItemSchema = createInsertSchema(quoteItems).omit({
  id: true,
  createdAt: true,
});

export const insertSavedListSchema = createInsertSchema(savedLists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavedListItemSchema = createInsertSchema(savedListItems).omit({
  id: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertCompanyUser = z.infer<typeof insertCompanyUserSchema>;
export type CompanyUser = typeof companyUsers.$inferSelect;

export type InsertDeviceCategory = z.infer<typeof insertDeviceCategorySchema>;
export type DeviceCategory = typeof deviceCategories.$inferSelect;

export type InsertDeviceModel = z.infer<typeof insertDeviceModelSchema>;
export type DeviceModel = typeof deviceModels.$inferSelect;

export type InsertDeviceVariant = z.infer<typeof insertDeviceVariantSchema>;
export type DeviceVariant = typeof deviceVariants.$inferSelect;

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export type InsertPriceTier = z.infer<typeof insertPriceTierSchema>;
export type PriceTier = typeof priceTiers.$inferSelect;

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertShippingAddress = z.infer<typeof insertShippingAddressSchema>;
export type ShippingAddress = typeof shippingAddresses.$inferSelect;

export type InsertBillingAddress = z.infer<typeof insertBillingAddressSchema>;
export type BillingAddress = typeof billingAddresses.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertQuoteItem = z.infer<typeof insertQuoteItemSchema>;
export type QuoteItem = typeof quoteItems.$inferSelect;

export type InsertSavedList = z.infer<typeof insertSavedListSchema>;
export type SavedList = typeof savedLists.$inferSelect;

export type InsertSavedListItem = z.infer<typeof insertSavedListItemSchema>;
export type SavedListItem = typeof savedListItems.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
