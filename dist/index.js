var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";

// server/db.ts
import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  announcements: () => announcements,
  auditLogs: () => auditLogs,
  auditLogsRelations: () => auditLogsRelations,
  billingAddresses: () => billingAddresses,
  billingAddressesRelations: () => billingAddressesRelations,
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  carts: () => carts,
  cartsRelations: () => cartsRelations,
  companies: () => companies,
  companiesRelations: () => companiesRelations,
  companyStatusEnum: () => companyStatusEnum,
  companyUserRoleEnum: () => companyUserRoleEnum,
  companyUsers: () => companyUsers,
  companyUsersRelations: () => companyUsersRelations,
  conditionGradeEnum: () => conditionGradeEnum,
  deviceCategories: () => deviceCategories,
  deviceCategoriesRelations: () => deviceCategoriesRelations,
  deviceModels: () => deviceModels,
  deviceModelsRelations: () => deviceModelsRelations,
  deviceVariants: () => deviceVariants,
  deviceVariantsRelations: () => deviceVariantsRelations,
  faqs: () => faqs,
  insertAnnouncementSchema: () => insertAnnouncementSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertBillingAddressSchema: () => insertBillingAddressSchema,
  insertCartItemSchema: () => insertCartItemSchema,
  insertCartSchema: () => insertCartSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertCompanyUserSchema: () => insertCompanyUserSchema,
  insertDeviceCategorySchema: () => insertDeviceCategorySchema,
  insertDeviceModelSchema: () => insertDeviceModelSchema,
  insertDeviceVariantSchema: () => insertDeviceVariantSchema,
  insertFaqSchema: () => insertFaqSchema,
  insertInventoryItemSchema: () => insertInventoryItemSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertPriceTierSchema: () => insertPriceTierSchema,
  insertQuoteItemSchema: () => insertQuoteItemSchema,
  insertQuoteSchema: () => insertQuoteSchema,
  insertSavedListItemSchema: () => insertSavedListItemSchema,
  insertSavedListSchema: () => insertSavedListSchema,
  insertShipmentSchema: () => insertShipmentSchema,
  insertShippingAddressSchema: () => insertShippingAddressSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertUserSchema: () => insertUserSchema,
  inventoryItems: () => inventoryItems,
  inventoryItemsRelations: () => inventoryItemsRelations,
  inventoryStatusEnum: () => inventoryStatusEnum,
  networkLockStatusEnum: () => networkLockStatusEnum,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orderStatusEnum: () => orderStatusEnum,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  paymentMethodEnum: () => paymentMethodEnum,
  paymentStatusEnum: () => paymentStatusEnum,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  priceTiers: () => priceTiers,
  priceTiersRelations: () => priceTiersRelations,
  quoteItems: () => quoteItems,
  quoteItemsRelations: () => quoteItemsRelations,
  quoteStatusEnum: () => quoteStatusEnum,
  quotes: () => quotes,
  quotesRelations: () => quotesRelations,
  savedListItems: () => savedListItems,
  savedListItemsRelations: () => savedListItemsRelations,
  savedLists: () => savedLists,
  savedListsRelations: () => savedListsRelations,
  shipments: () => shipments,
  shipmentsRelations: () => shipmentsRelations,
  shippingAddresses: () => shippingAddresses,
  shippingAddressesRelations: () => shippingAddressesRelations,
  supportTicketPriorityEnum: () => supportTicketPriorityEnum,
  supportTicketStatusEnum: () => supportTicketStatusEnum,
  supportTickets: () => supportTickets,
  supportTicketsRelations: () => supportTicketsRelations,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  real,
  text
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
var userRoleEnum = ["buyer", "admin", "super_admin"];
var companyStatusEnum = ["pending_review", "approved", "rejected", "suspended"];
var companyUserRoleEnum = ["owner", "admin", "buyer"];
var conditionGradeEnum = ["A", "B", "C", "D"];
var networkLockStatusEnum = ["unlocked", "locked", "other"];
var inventoryStatusEnum = ["in_stock", "reserved", "incoming", "discontinued"];
var orderStatusEnum = ["pending_payment", "payment_review", "processing", "shipped", "completed", "cancelled"];
var paymentStatusEnum = ["unpaid", "paid", "partially_paid", "refunded"];
var paymentMethodEnum = ["card", "wire", "ach", "terms", "other"];
var quoteStatusEnum = ["draft", "sent", "accepted", "rejected", "expired"];
var supportTicketStatusEnum = ["open", "in_progress", "closed"];
var supportTicketPriorityEnum = ["low", "medium", "high"];
var users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: userRoleEnum }).notNull().default("buyer"),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true)
});
var usersRelations = relations(users, ({ many }) => ({
  companyUsers: many(companyUsers),
  createdOrders: many(orders, { relationName: "orderCreator" }),
  createdQuotes: many(quotes, { relationName: "quoteCreator" }),
  createdSavedLists: many(savedLists),
  supportTickets: many(supportTickets),
  auditLogs: many(auditLogs)
}));
var companies = sqliteTable("companies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  legalName: text("legal_name").notNull(),
  taxId: text("tax_id"),
  resellerCertificateUrl: text("reseller_certificate_url"),
  website: text("website"),
  primaryPhone: text("primary_phone"),
  billingEmail: text("billing_email"),
  status: text("status", { enum: companyStatusEnum }).notNull().default("pending_review"),
  creditLimit: real("credit_limit").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var companiesRelations = relations(companies, ({ many }) => ({
  companyUsers: many(companyUsers),
  carts: many(carts),
  orders: many(orders),
  quotes: many(quotes),
  savedLists: many(savedLists),
  shippingAddresses: many(shippingAddresses),
  billingAddresses: many(billingAddresses),
  supportTickets: many(supportTickets)
}));
var companyUsers = sqliteTable("company_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleInCompany: text("role_in_company", { enum: companyUserRoleEnum }).notNull().default("buyer"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var companyUsersRelations = relations(companyUsers, ({ one }) => ({
  company: one(companies, {
    fields: [companyUsers.companyId],
    references: [companies.id]
  }),
  user: one(users, {
    fields: [companyUsers.userId],
    references: [users.id]
  })
}));
var deviceCategories = sqliteTable("device_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var deviceCategoriesRelations = relations(deviceCategories, ({ many }) => ({
  deviceModels: many(deviceModels)
}));
var deviceModels = sqliteTable("device_models", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  brand: text("brand").notNull(),
  name: text("name").notNull(),
  marketingName: text("marketing_name"),
  sku: text("sku").notNull().unique(),
  slug: text("slug").notNull().unique(),
  categoryId: text("category_id").notNull().references(() => deviceCategories.id),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true)
});
var deviceModelsRelations = relations(deviceModels, ({ one, many }) => ({
  category: one(deviceCategories, {
    fields: [deviceModels.categoryId],
    references: [deviceCategories.id]
  }),
  variants: many(deviceVariants)
}));
var deviceVariants = sqliteTable("device_variants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  deviceModelId: text("device_model_id").notNull().references(() => deviceModels.id, { onDelete: "cascade" }),
  storage: text("storage").notNull(),
  color: text("color").notNull(),
  networkLockStatus: text("network_lock_status", { enum: networkLockStatusEnum }).notNull().default("unlocked"),
  conditionGrade: text("condition_grade", { enum: conditionGradeEnum }).notNull(),
  internalCode: text("internal_code"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var deviceVariantsRelations = relations(deviceVariants, ({ one, many }) => ({
  deviceModel: one(deviceModels, {
    fields: [deviceVariants.deviceModelId],
    references: [deviceModels.id]
  }),
  inventoryItems: many(inventoryItems),
  priceTiers: many(priceTiers),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  quoteItems: many(quoteItems),
  savedListItems: many(savedListItems)
}));
var inventoryItems = sqliteTable("inventory_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  deviceVariantId: text("device_variant_id").notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  quantityAvailable: integer("quantity_available").notNull().default(0),
  minOrderQuantity: integer("min_order_quantity").notNull().default(1),
  location: text("location"),
  status: text("status", { enum: inventoryStatusEnum }).notNull().default("in_stock"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  deviceVariant: one(deviceVariants, {
    fields: [inventoryItems.deviceVariantId],
    references: [deviceVariants.id]
  })
}));
var priceTiers = sqliteTable("price_tiers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  deviceVariantId: text("device_variant_id").notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  minQuantity: integer("min_quantity").notNull(),
  maxQuantity: integer("max_quantity"),
  unitPrice: real("unit_price").notNull(),
  currency: text("currency").notNull().default("USD"),
  effectiveFrom: integer("effective_from", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  effectiveTo: integer("effective_to", { mode: "timestamp" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true)
});
var priceTiersRelations = relations(priceTiers, ({ one }) => ({
  deviceVariant: one(deviceVariants, {
    fields: [priceTiers.deviceVariantId],
    references: [deviceVariants.id]
  })
}));
var carts = sqliteTable("carts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  }),
  company: one(companies, {
    fields: [carts.companyId],
    references: [companies.id]
  }),
  items: many(cartItems)
}));
var cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  deviceVariantId: text("device_variant_id").notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPriceSnapshot: real("unit_price_snapshot").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id]
  }),
  deviceVariant: one(deviceVariants, {
    fields: [cartItems.deviceVariantId],
    references: [deviceVariants.id]
  })
}));
var orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text("order_number").notNull().unique(),
  companyId: text("company_id").notNull().references(() => companies.id),
  createdByUserId: text("created_by_user_id").notNull().references(() => users.id),
  status: text("status", { enum: orderStatusEnum }).notNull().default("pending_payment"),
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull().default(0),
  taxAmount: real("tax_amount").notNull().default(0),
  discountAmount: real("discount_amount").notNull().default(0),
  total: real("total").notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentStatus: text("payment_status", { enum: paymentStatusEnum }).notNull().default("unpaid"),
  paymentMethod: text("payment_method", { enum: paymentMethodEnum }),
  shippingAddressId: text("shipping_address_id").references(() => shippingAddresses.id),
  billingAddressId: text("billing_address_id").references(() => billingAddresses.id),
  notesInternal: text("notes_internal"),
  notesCustomer: text("notes_customer"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var ordersRelations = relations(orders, ({ one, many }) => ({
  company: one(companies, {
    fields: [orders.companyId],
    references: [companies.id]
  }),
  createdBy: one(users, {
    fields: [orders.createdByUserId],
    references: [users.id],
    relationName: "orderCreator"
  }),
  items: many(orderItems),
  payments: many(payments),
  shipments: many(shipments)
}));
var orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  deviceVariantId: text("device_variant_id").notNull().references(() => deviceVariants.id),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  lineTotal: real("line_total").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  deviceVariant: one(deviceVariants, {
    fields: [orderItems.deviceVariantId],
    references: [deviceVariants.id]
  })
}));
var shippingAddresses = sqliteTable("shipping_addresses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  label: text("label"),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  street1: text("street1").notNull(),
  street2: text("street2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("USA"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var shippingAddressesRelations = relations(shippingAddresses, ({ one }) => ({
  company: one(companies, {
    fields: [shippingAddresses.companyId],
    references: [companies.id]
  })
}));
var billingAddresses = sqliteTable("billing_addresses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  label: text("label"),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  street1: text("street1").notNull(),
  street2: text("street2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("USA"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var billingAddressesRelations = relations(billingAddresses, ({ one }) => ({
  company: one(companies, {
    fields: [billingAddresses.companyId],
    references: [companies.id]
  })
}));
var quotes = sqliteTable("quotes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  quoteNumber: text("quote_number").notNull().unique(),
  companyId: text("company_id").notNull().references(() => companies.id),
  createdByUserId: text("created_by_user_id").notNull().references(() => users.id),
  status: text("status", { enum: quoteStatusEnum }).notNull().default("draft"),
  validUntil: integer("valid_until", { mode: "timestamp" }),
  subtotal: real("subtotal").notNull().default(0),
  shippingEstimate: real("shipping_estimate").notNull().default(0),
  taxEstimate: real("tax_estimate").notNull().default(0),
  totalEstimate: real("total_estimate").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var quotesRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, {
    fields: [quotes.companyId],
    references: [companies.id]
  }),
  createdBy: one(users, {
    fields: [quotes.createdByUserId],
    references: [users.id],
    relationName: "quoteCreator"
  }),
  items: many(quoteItems)
}));
var quoteItems = sqliteTable("quote_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  quoteId: text("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  deviceVariantId: text("device_variant_id").notNull().references(() => deviceVariants.id),
  quantity: integer("quantity").notNull(),
  proposedUnitPrice: real("proposed_unit_price").notNull(),
  lineTotalEstimate: real("line_total_estimate").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id]
  }),
  deviceVariant: one(deviceVariants, {
    fields: [quoteItems.deviceVariantId],
    references: [deviceVariants.id]
  })
}));
var savedLists = sqliteTable("saved_lists", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdByUserId: text("created_by_user_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var savedListsRelations = relations(savedLists, ({ one, many }) => ({
  company: one(companies, {
    fields: [savedLists.companyId],
    references: [companies.id]
  }),
  createdBy: one(users, {
    fields: [savedLists.createdByUserId],
    references: [users.id]
  }),
  items: many(savedListItems)
}));
var savedListItems = sqliteTable("saved_list_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  savedListId: text("saved_list_id").notNull().references(() => savedLists.id, { onDelete: "cascade" }),
  deviceVariantId: text("device_variant_id").notNull().references(() => deviceVariants.id, { onDelete: "cascade" }),
  defaultQuantity: integer("default_quantity").notNull().default(1)
});
var savedListItemsRelations = relations(savedListItems, ({ one }) => ({
  savedList: one(savedLists, {
    fields: [savedListItems.savedListId],
    references: [savedLists.id]
  }),
  deviceVariant: one(deviceVariants, {
    fields: [savedListItems.deviceVariantId],
    references: [deviceVariants.id]
  })
}));
var payments = sqliteTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull(),
  method: text("method", { enum: paymentMethodEnum }).notNull(),
  processedAt: integer("processed_at", { mode: "timestamp" })
});
var paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id]
  })
}));
var shipments = sqliteTable("shipments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier").notNull(),
  serviceLevel: text("service_level"),
  trackingNumber: text("tracking_number"),
  shippingLabelUrl: text("shipping_label_url"),
  shippedAt: integer("shipped_at", { mode: "timestamp" }),
  estimatedDeliveryDate: integer("estimated_delivery_date", { mode: "timestamp" })
});
var shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id]
  })
}));
var faqs = sqliteTable("faqs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var announcements = sqliteTable("announcements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  body: text("body").notNull(),
  startsAt: integer("starts_at", { mode: "timestamp" }),
  endsAt: integer("ends_at", { mode: "timestamp" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var supportTickets = sqliteTable("support_tickets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }),
  createdByUserId: text("created_by_user_id").references(() => users.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: supportTicketStatusEnum }).notNull().default("open"),
  priority: text("priority", { enum: supportTicketPriorityEnum }).notNull().default("medium"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  company: one(companies, {
    fields: [supportTickets.companyId],
    references: [companies.id]
  }),
  createdBy: one(users, {
    fields: [supportTickets.createdByUserId],
    references: [users.id]
  })
}));
var auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  actorUserId: text("actor_user_id").references(() => users.id),
  companyId: text("company_id").references(() => companies.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  previousValues: text("previous_values"),
  newValues: text("new_values"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});
var auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
});
var insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCompanyUserSchema = createInsertSchema(companyUsers).omit({
  id: true,
  createdAt: true
});
var insertDeviceCategorySchema = createInsertSchema(deviceCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDeviceModelSchema = createInsertSchema(deviceModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDeviceVariantSchema = createInsertSchema(deviceVariants).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPriceTierSchema = createInsertSchema(priceTiers).omit({
  id: true
});
var insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true
});
var insertShippingAddressSchema = createInsertSchema(shippingAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBillingAddressSchema = createInsertSchema(billingAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertQuoteItemSchema = createInsertSchema(quoteItems).omit({
  id: true,
  createdAt: true
});
var insertSavedListSchema = createInsertSchema(savedLists).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSavedListItemSchema = createInsertSchema(savedListItems).omit({
  id: true
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true
});
var insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true
});
var insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true
});
var insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true
});

// server/db.ts
var databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
var databaseFile = databaseUrl.replace(/^file:/, "");
var sqlite = new Database(databaseFile);
var db = drizzle(sqlite, { schema: schema_exports });

// server/storage.ts
import { eq, and, desc, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  async getAllUsers() {
    const users2 = await db.select().from(users);
    return users2;
  }
  // Company methods
  async getCompany(id) {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || void 0;
  }
  async createCompany(insertCompany) {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }
  async updateCompany(id, updates) {
    const [company] = await db.update(companies).set(updates).where(eq(companies.id, id)).returning();
    return company || void 0;
  }
  async getAllCompanies() {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
  }
  // CompanyUser methods
  async createCompanyUser(insertCompanyUser) {
    const [companyUser] = await db.insert(companyUsers).values(insertCompanyUser).returning();
    return companyUser;
  }
  async getCompanyUsersByUserId(userId) {
    return await db.select().from(companyUsers).where(eq(companyUsers.userId, userId));
  }
  async getCompanyUsersByCompanyId(companyId) {
    return await db.select().from(companyUsers).where(eq(companyUsers.companyId, companyId));
  }
  // Device Category methods
  async getAllCategories() {
    return await db.select().from(deviceCategories);
  }
  async getCategory(id) {
    const [category] = await db.select().from(deviceCategories).where(eq(deviceCategories.id, id));
    return category || void 0;
  }
  async getCategoryBySlug(slug) {
    const [category] = await db.select().from(deviceCategories).where(eq(deviceCategories.slug, slug));
    return category || void 0;
  }
  async createCategory(insertCategory) {
    const [category] = await db.insert(deviceCategories).values(insertCategory).returning();
    return category;
  }
  // Device Model methods
  async getAllDeviceModels() {
    return await db.select().from(deviceModels).where(eq(deviceModels.isActive, true));
  }
  async getDeviceModel(id) {
    const [model] = await db.select().from(deviceModels).where(eq(deviceModels.id, id));
    return model || void 0;
  }
  async getDeviceModelBySlug(slug) {
    const [model] = await db.select().from(deviceModels).where(eq(deviceModels.slug, slug));
    return model || void 0;
  }
  async createDeviceModel(insertModel) {
    const [model] = await db.insert(deviceModels).values(insertModel).returning();
    return model;
  }
  // Device Variant methods
  async getDeviceVariant(id) {
    const [variant] = await db.select().from(deviceVariants).where(eq(deviceVariants.id, id));
    return variant || void 0;
  }
  async getDeviceVariantsByModelId(modelId) {
    return await db.select().from(deviceVariants).where(eq(deviceVariants.deviceModelId, modelId));
  }
  async createDeviceVariant(insertVariant) {
    const [variant] = await db.insert(deviceVariants).values(insertVariant).returning();
    return variant;
  }
  async updateDeviceVariant(id, updates) {
    const [variant] = await db.update(deviceVariants).set(updates).where(eq(deviceVariants.id, id)).returning();
    return variant || void 0;
  }
  // Inventory methods
  async getInventoryByVariantId(variantId) {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.deviceVariantId, variantId));
    return item || void 0;
  }
  async createInventory(insertInventory) {
    const [item] = await db.insert(inventoryItems).values(insertInventory).returning();
    return item;
  }
  async updateInventory(id, updates) {
    const [item] = await db.update(inventoryItems).set(updates).where(eq(inventoryItems.id, id)).returning();
    return item || void 0;
  }
  // Price Tier methods
  async getPriceTiersByVariantId(variantId) {
    return await db.select().from(priceTiers).where(and(
      eq(priceTiers.deviceVariantId, variantId),
      eq(priceTiers.isActive, true)
    )).orderBy(priceTiers.minQuantity);
  }
  async createPriceTier(insertTier) {
    const [tier] = await db.insert(priceTiers).values(insertTier).returning();
    return tier;
  }
  // Cart methods
  async getCartByUserId(userId) {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
    return cart || void 0;
  }
  async createCart(insertCart) {
    const [cart] = await db.insert(carts).values(insertCart).returning();
    return cart;
  }
  async getCartItems(cartId) {
    return await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  }
  async addCartItem(insertItem) {
    const [item] = await db.insert(cartItems).values(insertItem).returning();
    return item;
  }
  async updateCartItem(id, updates) {
    const [item] = await db.update(cartItems).set(updates).where(eq(cartItems.id, id)).returning();
    return item || void 0;
  }
  async removeCartItem(id) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }
  async clearCart(cartId) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }
  // Order methods
  async createOrder(insertOrder) {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || void 0;
  }
  async getOrderByNumber(orderNumber) {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order || void 0;
  }
  async getOrdersByCompanyId(companyId) {
    return await db.select().from(orders).where(eq(orders.companyId, companyId)).orderBy(desc(orders.createdAt));
  }
  async updateOrder(id, updates) {
    const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return order || void 0;
  }
  async getAllOrders() {
    const orders2 = await db.select().from(orders);
    return orders2;
  }
  async createOrderItem(insertItem) {
    const [item] = await db.insert(orderItems).values(insertItem).returning();
    return item;
  }
  async getOrderItems(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  // Shipping/Billing Address methods
  async getShippingAddressesByCompanyId(companyId) {
    return await db.select().from(shippingAddresses).where(eq(shippingAddresses.companyId, companyId));
  }
  async createShippingAddress(insertAddress) {
    const [address] = await db.insert(shippingAddresses).values(insertAddress).returning();
    return address;
  }
  async updateShippingAddress(id, updates) {
    const [address] = await db.update(shippingAddresses).set(updates).where(eq(shippingAddresses.id, id)).returning();
    return address || void 0;
  }
  async getBillingAddressesByCompanyId(companyId) {
    return await db.select().from(billingAddresses).where(eq(billingAddresses.companyId, companyId));
  }
  async createBillingAddress(insertAddress) {
    const [address] = await db.insert(billingAddresses).values(insertAddress).returning();
    return address;
  }
  // Quote methods
  async createQuote(insertQuote) {
    const [quote] = await db.insert(quotes).values(insertQuote).returning();
    return quote;
  }
  async getQuote(id) {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || void 0;
  }
  async getQuotesByCompanyId(companyId) {
    return await db.select().from(quotes).where(eq(quotes.companyId, companyId)).orderBy(desc(quotes.createdAt));
  }
  async updateQuote(id, updates) {
    const [quote] = await db.update(quotes).set(updates).where(eq(quotes.id, id)).returning();
    return quote || void 0;
  }
  async createQuoteItem(insertItem) {
    const [item] = await db.insert(quoteItems).values(insertItem).returning();
    return item;
  }
  async getQuoteItems(quoteId) {
    return await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quoteId));
  }
  // Saved List methods
  async getSavedListsByCompanyId(companyId) {
    return await db.select().from(savedLists).where(eq(savedLists.companyId, companyId));
  }
  async createSavedList(insertList) {
    const [list] = await db.insert(savedLists).values(insertList).returning();
    return list;
  }
  async getSavedListItems(listId) {
    return await db.select().from(savedListItems).where(eq(savedListItems.savedListId, listId));
  }
  async addSavedListItem(insertItem) {
    const [item] = await db.insert(savedListItems).values(insertItem).returning();
    return item;
  }
  async getSavedList(id) {
    const [list] = await db.select().from(savedLists).where(eq(savedLists.id, id));
    return list || void 0;
  }
  async deleteSavedList(id) {
    await db.delete(savedLists).where(eq(savedLists.id, id));
  }
  async deleteSavedListItem(id) {
    await db.delete(savedListItems).where(eq(savedListItems.id, id));
  }
  // Payment methods
  async createPayment(insertPayment) {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }
  async getPaymentsByOrderId(orderId) {
    return await db.select().from(payments).where(eq(payments.orderId, orderId));
  }
  // Shipment methods
  async createShipment(insertShipment) {
    const [shipment] = await db.insert(shipments).values(insertShipment).returning();
    return shipment;
  }
  async getShipmentsByOrderId(orderId) {
    return await db.select().from(shipments).where(eq(shipments.orderId, orderId));
  }
  // FAQ methods
  async getAllFaqs() {
    return await db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(faqs.category, faqs.displayOrder);
  }
  async createFaq(insertFaq) {
    const [faq] = await db.insert(faqs).values(insertFaq).returning();
    return faq;
  }
  // Announcement methods
  async getActiveAnnouncements() {
    const now = /* @__PURE__ */ new Date();
    return await db.select().from(announcements).where(
      and(
        eq(announcements.isActive, true),
        sql2`${announcements.startsAt} <= ${now}`,
        sql2`(${announcements.endsAt} IS NULL OR ${announcements.endsAt} >= ${now})`
      )
    );
  }
  async createAnnouncement(insertAnnouncement) {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }
  // Support Ticket methods
  async createSupportTicket(insertTicket) {
    const [ticket] = await db.insert(supportTickets).values(insertTicket).returning();
    return ticket;
  }
  async getSupportTicketsByCompanyId(companyId) {
    return await db.select().from(supportTickets).where(eq(supportTickets.companyId, companyId)).orderBy(desc(supportTickets.createdAt));
  }
  async updateSupportTicket(id, updates) {
    const [ticket] = await db.update(supportTickets).set(updates).where(eq(supportTickets.id, id)).returning();
    return ticket || void 0;
  }
  // Audit Log methods
  async createAuditLog(insertLog) {
    const [log2] = await db.insert(auditLogs).values(insertLog).returning();
    return log2;
  }
  async getAuditLogs(limit = 100) {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { z } from "zod";
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover"
  });
}
var requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};
var getUserPrimaryCompany = async (userId) => {
  const companyUsers2 = await storage.getCompanyUsersByUserId(userId);
  if (companyUsers2.length === 0) {
    return null;
  }
  return {
    companyId: companyUsers2[0].companyId,
    roleInCompany: companyUsers2[0].roleInCompany
  };
};
var selectPriceTierForQuantity = (tiers, quantity) => {
  const activeTiers = tiers.filter((tier) => tier.isActive !== false);
  const sortedTiers = activeTiers.sort((a, b) => a.minQuantity - b.minQuantity);
  const exactMatch = sortedTiers.find((tier) => {
    const withinMin = quantity >= tier.minQuantity;
    const withinMax = tier.maxQuantity ? quantity <= tier.maxQuantity : true;
    return withinMin && withinMax;
  });
  if (exactMatch) return exactMatch;
  const fallback = [...sortedTiers].filter((tier) => quantity >= tier.minQuantity).sort((a, b) => b.minQuantity - a.minQuantity)[0];
  return fallback || null;
};
var requireAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "admin" && user.role !== "super_admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
async function registerRoutes(app2) {
  const sessionSecret = process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? (() => {
    throw new Error("SESSION_SECRET must be set in production");
  })() : "dev-secret-only-for-local-development");
  const MemoryStore = createMemoryStore(session);
  app2.use(session({
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 60 * 1e3
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    }
  }));
  app2.get("/api/public/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get public categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.get("/api/public/catalog", async (req, res) => {
    try {
      const devices = await storage.getAllDeviceModels();
      const publicDevices = await Promise.all(
        devices.map(async (device) => {
          const variants = await storage.getDeviceVariantsByModelId(device.id);
          const category = await storage.getCategory(device.categoryId);
          const conditionValues = variants.map((v) => v.conditionGrade).filter((c) => c !== null && c !== void 0);
          const storageValues = variants.map((v) => v.storage).filter((s) => s !== null && s !== void 0);
          const colorValues = variants.map((v) => v.color).filter((c) => c !== null && c !== void 0);
          return {
            id: device.id,
            brand: device.brand,
            marketingName: device.marketingName,
            slug: device.slug,
            categoryId: device.categoryId,
            categoryName: category?.name || "Unknown",
            imageUrl: device.imageUrl,
            description: device.description,
            variantCount: variants.length,
            // Don't include pricing for public view
            availableConditions: Array.from(new Set(conditionValues)),
            availableStorage: Array.from(new Set(storageValues)),
            availableColors: Array.from(new Set(colorValues))
          };
        })
      );
      res.json(publicDevices);
    } catch (error) {
      console.error("Get public catalog error:", error);
      res.status(500).json({ error: "Failed to fetch catalog" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const registerSchema = z.object({
        // User data
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        password: z.string().min(6),
        // Company data
        companyName: z.string(),
        legalName: z.string(),
        website: z.string().optional(),
        taxId: z.string().optional(),
        businessType: z.string(),
        // Address data
        contactName: z.string(),
        addressPhone: z.string(),
        street1: z.string(),
        street2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string()
      });
      const data = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: "buyer",
        isActive: true
      });
      const company = await storage.createCompany({
        name: data.companyName,
        legalName: data.legalName,
        website: data.website || null,
        taxId: data.taxId || null,
        primaryPhone: data.phone,
        billingEmail: data.email,
        status: "pending_review",
        creditLimit: "0"
      });
      await storage.createCompanyUser({
        userId: user.id,
        companyId: company.id,
        roleInCompany: "owner"
      });
      await storage.createShippingAddress({
        companyId: company.id,
        contactName: data.contactName,
        phone: data.addressPhone,
        street1: data.street1,
        street2: data.street2 || null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: "USA",
        isDefault: true
      });
      res.json({ success: true, userId: user.id, companyId: company.id });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (!user.isActive) {
        return res.status(403).json({ error: "Account is inactive" });
      }
      await storage.updateUser(user.id, { lastLoginAt: /* @__PURE__ */ new Date() });
      req.session.userId = user.id;
      req.session.userRole = user.role;
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });
  const getMeHandler = async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const companyUsers2 = await storage.getCompanyUsersByUserId(user.id);
      let companyId = null;
      if (companyUsers2.length > 0) {
        companyId = companyUsers2[0].companyId;
      }
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyId
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  };
  app2.get("/api/auth/me", requireAuth, getMeHandler);
  app2.get("/api/me", requireAuth, getMeHandler);
  app2.get("/api/auth/company", requireAuth, async (req, res) => {
    try {
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext) {
        return res.status(404).json({ error: "User does not belong to a company" });
      }
      const company = await storage.getCompany(companyContext.companyId);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json({
        ...company,
        roleInCompany: companyContext.roleInCompany
      });
    } catch (error) {
      console.error("Get company error:", error);
      res.status(500).json({ error: "Failed to load company" });
    }
  });
  app2.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const companyUsers2 = await storage.getCompanyUsersByUserId(user.id);
      let company = null;
      let roleInCompany = null;
      if (companyUsers2.length > 0) {
        company = await storage.getCompany(companyUsers2[0].companyId);
        roleInCompany = companyUsers2[0].roleInCompany;
      }
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({
        ...userWithoutPassword,
        company,
        roleInCompany
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });
  app2.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const updateSchema = z.object({
        name: z.string().min(1).optional(),
        phone: z.string().nullable().optional()
      });
      const updates = updateSchema.parse(req.body);
      const updatedUser = await storage.updateUser(req.session.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const { passwordHash, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.post("/api/profile/password", requireAuth, async (req, res) => {
    try {
      const passwordSchema = z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8)
      });
      const { currentPassword, newPassword } = passwordSchema.parse(req.body);
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { passwordHash: newPasswordHash });
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid password data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to change password" });
    }
  });
  app2.get("/api/catalog/models", async (req, res) => {
    try {
      const models = await storage.getAllDeviceModels();
      res.json(models);
    } catch (error) {
      console.error("Get models error:", error);
      res.status(500).json({ error: "Failed to get models" });
    }
  });
  app2.get("/api/catalog/models/:slug", async (req, res) => {
    try {
      const model = await storage.getDeviceModelBySlug(req.params.slug);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      const variants = await storage.getDeviceVariantsByModelId(model.id);
      const variantsWithDetails = await Promise.all(
        variants.map(async (variant) => {
          const inventory = await storage.getInventoryByVariantId(variant.id);
          const priceTiers2 = await storage.getPriceTiersByVariantId(variant.id);
          return { ...variant, inventory, priceTiers: priceTiers2 };
        })
      );
      res.json({ ...model, variants: variantsWithDetails });
    } catch (error) {
      console.error("Get model error:", error);
      res.status(500).json({ error: "Failed to get model" });
    }
  });
  app2.get("/api/catalog", async (req, res) => {
    try {
      const models = await storage.getAllDeviceModels();
      const modelsWithVariants = await Promise.all(
        models.map(async (model) => {
          const variants = await storage.getDeviceVariantsByModelId(model.id);
          const variantsWithDetails = await Promise.all(
            variants.map(async (variant) => {
              const inventory = await storage.getInventoryByVariantId(variant.id);
              const priceTiers2 = await storage.getPriceTiersByVariantId(variant.id);
              return { ...variant, inventory, priceTiers: priceTiers2, deviceModel: model };
            })
          );
          return { ...model, variants: variantsWithDetails };
        })
      );
      res.json(modelsWithVariants);
    } catch (error) {
      console.error("Get catalog error:", error);
      res.status(500).json({ error: "Failed to get catalog" });
    }
  });
  const getCategoriesHandler = async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  };
  app2.get("/api/catalog/categories", getCategoriesHandler);
  app2.get("/api/categories", getCategoriesHandler);
  app2.get("/api/cart", requireAuth, async (req, res) => {
    try {
      let cart = await storage.getCartByUserId(req.session.userId);
      if (!cart) {
        const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
        if (companyUsers2.length === 0) {
          return res.status(400).json({ error: "No company found for user" });
        }
        cart = await storage.createCart({
          userId: req.session.userId,
          companyId: companyUsers2[0].companyId
        });
      }
      const items = await storage.getCartItems(cart.id);
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const variant = await storage.getDeviceVariant(item.deviceVariantId);
          const model = variant ? await storage.getDeviceModel(variant.deviceModelId) : null;
          return {
            ...item,
            unitPrice: item.unitPriceSnapshot,
            // Map to unitPrice for frontend
            variant: variant ? {
              ...variant,
              deviceModel: model
            } : null
          };
        })
      );
      res.json({ cart, items: itemsWithDetails });
    } catch (error) {
      console.error("Get cart error:", error);
      res.status(500).json({ error: "Failed to get cart" });
    }
  });
  app2.post("/api/cart/items", requireAuth, async (req, res) => {
    try {
      const { deviceVariantId, quantity } = req.body;
      let cart = await storage.getCartByUserId(req.session.userId);
      if (!cart) {
        const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
        cart = await storage.createCart({
          userId: req.session.userId,
          companyId: companyUsers2[0].companyId
        });
      }
      const priceTiers2 = await storage.getPriceTiersByVariantId(deviceVariantId);
      const applicableTier = priceTiers2.find(
        (tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
      );
      let unitPrice = applicableTier?.unitPrice;
      if (!unitPrice && priceTiers2.length > 0) {
        const sortedTiers = [...priceTiers2].sort((a, b) => a.minQuantity - b.minQuantity);
        const lowestTier = sortedTiers[0];
        const highestTier = sortedTiers[sortedTiers.length - 1];
        if (quantity < lowestTier.minQuantity) {
          unitPrice = lowestTier.unitPrice;
        } else if (quantity >= highestTier.minQuantity) {
          unitPrice = highestTier.unitPrice;
        } else {
          unitPrice = lowestTier.unitPrice;
        }
      }
      if (!unitPrice) {
        const variant = await storage.getDeviceVariant(deviceVariantId);
        unitPrice = variant?.minPrice;
      }
      if (!unitPrice) {
        return res.status(400).json({
          error: "Unable to determine price for this item. Please contact support."
        });
      }
      const item = await storage.addCartItem({
        cartId: cart.id,
        deviceVariantId,
        quantity,
        unitPriceSnapshot: unitPrice
      });
      res.json(item);
    } catch (error) {
      console.error("Add cart item error:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });
  app2.patch("/api/cart/items/:id", requireAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      const item = await storage.updateCartItem(req.params.id, { quantity });
      res.json(item);
    } catch (error) {
      console.error("Update cart item error:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });
  app2.delete("/api/cart/items/:id", requireAuth, async (req, res) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Remove cart item error:", error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });
  app2.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const { paymentMethod, shippingAddressId, billingAddressId, notes } = req.body;
      if (!shippingAddressId) {
        return res.status(400).json({ error: "Shipping address is required" });
      }
      if (!billingAddressId) {
        return res.status(400).json({ error: "Billing address is required" });
      }
      if (paymentMethod === "card" && !stripe) {
        return res.status(503).json({ error: "Card payment is not available. Please select another payment method." });
      }
      const cart = await storage.getCartByUserId(req.session.userId);
      if (!cart) {
        return res.status(400).json({ error: "Cart not found" });
      }
      const items = await storage.getCartItems(cart.id);
      if (items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
      let subtotal = 0;
      for (const item of items) {
        subtotal += parseFloat(item.unitPriceSnapshot) * item.quantity;
      }
      const shippingCost = 25;
      const taxAmount = subtotal * 0.08;
      const total = subtotal + shippingCost + taxAmount;
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      const order = await storage.createOrder({
        orderNumber,
        companyId: cart.companyId,
        createdByUserId: req.session.userId,
        status: "pending_payment",
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        discountAmount: "0",
        total: total.toFixed(2),
        currency: "USD",
        paymentStatus: "unpaid",
        paymentMethod: paymentMethod || "card",
        shippingAddressId: shippingAddressId || null,
        billingAddressId: billingAddressId || null,
        notesCustomer: notes || null
      });
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          deviceVariantId: item.deviceVariantId,
          quantity: item.quantity,
          unitPrice: item.unitPriceSnapshot,
          lineTotal: (parseFloat(item.unitPriceSnapshot) * item.quantity).toFixed(2)
        });
      }
      await storage.clearCart(cart.id);
      res.json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });
  app2.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
      if (companyUsers2.length === 0) {
        return res.json([]);
      }
      const orders2 = await storage.getOrdersByCompanyId(companyUsers2[0].companyId);
      res.json(orders2);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });
  app2.get("/api/orders/:orderNumber", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const items = await storage.getOrderItems(order.id);
      const payments2 = await storage.getPaymentsByOrderId(order.id);
      const shipments2 = await storage.getShipmentsByOrderId(order.id);
      res.json({ ...order, items, payments: payments2, shipments: shipments2 });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Failed to get order" });
    }
  });
  app2.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing is not configured" });
      }
      const { amount, orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
      const hasAccess = companyUsers2.some((cu) => cu.companyId === order.companyId);
      if (!hasAccess && req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100),
        // Convert to cents
        currency: "usd",
        metadata: {
          orderId,
          userId: req.session.userId,
          orderNumber: order.orderNumber
        }
      });
      await storage.updateOrder(orderId, {
        notesInternal: `Stripe Payment Intent: ${paymentIntent.id}`
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Create payment intent error:", error);
      res.status(500).json({ error: "Failed to create payment intent: " + error.message });
    }
  });
  app2.post("/api/confirm-payment", requireAuth, async (req, res) => {
    try {
      const { orderId, paymentIntentId } = req.body;
      if (!orderId || !paymentIntentId) {
        return res.status(400).json({ error: "Order ID and payment intent ID are required" });
      }
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing is not configured" });
      }
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
      const hasAccess = companyUsers2.some((cu) => cu.companyId === order.companyId);
      if (!hasAccess && req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.metadata.orderId !== orderId) {
        return res.status(400).json({ error: "Payment intent does not match order" });
      }
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment has not succeeded" });
      }
      const orderTotalCents = Math.round(parseFloat(order.total) * 100);
      if (paymentIntent.amount !== orderTotalCents) {
        return res.status(400).json({ error: "Payment amount does not match order total" });
      }
      await storage.updateOrder(orderId, {
        status: "processing",
        paymentStatus: "paid"
      });
      await storage.createPayment({
        orderId,
        amount: (paymentIntent.amount / 100).toFixed(2),
        currency: paymentIntent.currency.toUpperCase(),
        method: "card",
        status: "paid",
        stripePaymentIntentId: paymentIntent.id,
        processedAt: /* @__PURE__ */ new Date()
      });
      res.json({ success: true, order });
    } catch (error) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ error: "Failed to confirm payment: " + error.message });
    }
  });
  app2.get("/api/companies/:id", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      if (req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
        const isMember = companyUsers2.some((cu) => cu.companyId === req.params.id);
        if (!isMember) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      const shippingAddresses2 = await storage.getShippingAddressesByCompanyId(company.id);
      const billingAddresses2 = await storage.getBillingAddressesByCompanyId(company.id);
      res.json({
        ...company,
        shippingAddresses: shippingAddresses2,
        billingAddresses: billingAddresses2
      });
    } catch (error) {
      console.error("Get company error:", error);
      res.status(500).json({ error: "Failed to get company" });
    }
  });
  app2.get("/api/admin/companies", requireAdmin, async (req, res) => {
    try {
      const companies2 = await storage.getAllCompanies();
      res.json(companies2);
    } catch (error) {
      console.error("Get companies error:", error);
      res.status(500).json({ error: "Failed to get companies" });
    }
  });
  app2.patch("/api/admin/companies/:id", requireAdmin, async (req, res) => {
    try {
      const { status, creditLimit } = req.body;
      const updates = {};
      if (status) updates.status = status;
      if (creditLimit !== void 0) updates.creditLimit = creditLimit;
      const company = await storage.updateCompany(req.params.id, updates);
      await storage.createAuditLog({
        actorUserId: req.session.userId,
        companyId: req.params.id,
        action: "company_updated",
        entityType: "company",
        entityId: req.params.id,
        newValues: JSON.stringify(updates)
      });
      res.json(company);
    } catch (error) {
      console.error("Update company error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });
  app2.post("/api/quotes", requireAuth, async (req, res) => {
    try {
      const { items, notes, validUntil } = req.body;
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext) {
        return res.status(400).json({ error: "No company found for user" });
      }
      const companyId = companyContext.companyId;
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const quoteNumber = `QT-${timestamp}-${random}`;
      let subtotal = 0;
      const preparedItems = [];
      for (const item of items) {
        const tiers = await storage.getPriceTiersByVariantId(item.deviceVariantId);
        const matchingTier = selectPriceTierForQuantity(tiers, item.quantity);
        if (!matchingTier) {
          return res.status(400).json({ error: "No pricing available for one or more items" });
        }
        const unitPrice = parseFloat(matchingTier.unitPrice);
        if (isNaN(unitPrice)) {
          return res.status(400).json({ error: "Invalid pricing data for selected item" });
        }
        preparedItems.push({
          deviceVariantId: item.deviceVariantId,
          quantity: item.quantity,
          unitPrice
        });
        subtotal += unitPrice * item.quantity;
      }
      const shippingEstimate = 0;
      const taxEstimate = 0;
      const totalEstimate = subtotal + shippingEstimate + taxEstimate;
      const quote = await storage.createQuote({
        quoteNumber,
        companyId,
        createdByUserId: req.session.userId,
        status: "draft",
        validUntil: validUntil ? new Date(validUntil) : null,
        subtotal: subtotal.toFixed(2),
        shippingEstimate: shippingEstimate.toFixed(2),
        taxEstimate: taxEstimate.toFixed(2),
        totalEstimate: totalEstimate.toFixed(2),
        currency: "USD"
      });
      for (const item of preparedItems) {
        await storage.createQuoteItem({
          quoteId: quote.id,
          deviceVariantId: item.deviceVariantId,
          quantity: item.quantity,
          proposedUnitPrice: item.unitPrice.toFixed(2),
          lineTotalEstimate: (item.unitPrice * item.quantity).toFixed(2)
        });
      }
      res.json(quote);
    } catch (error) {
      console.error("Create quote error:", error);
      res.status(500).json({ error: "Failed to create quote" });
    }
  });
  app2.get("/api/quotes/:id", requireAuth, async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      if (req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
        const isMember = companyUsers2.some((cu) => cu.companyId === quote.companyId);
        if (!isMember) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      const items = await storage.getQuoteItems(quote.id);
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const variant = await storage.getDeviceVariant(item.deviceVariantId);
          const model = variant ? await storage.getDeviceModel(variant.deviceModelId) : null;
          return { ...item, variant, model };
        })
      );
      res.json({ ...quote, items: itemsWithDetails });
    } catch (error) {
      console.error("Get quote error:", error);
      res.status(500).json({ error: "Failed to get quote" });
    }
  });
  app2.get("/api/companies/:companyId/quotes", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
        const isMember = companyUsers2.some((cu) => cu.companyId === req.params.companyId);
        if (!isMember) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      const quotes2 = await storage.getQuotesByCompanyId(req.params.companyId);
      res.json(quotes2);
    } catch (error) {
      console.error("Get company quotes error:", error);
      res.status(500).json({ error: "Failed to get company quotes" });
    }
  });
  app2.patch("/api/quotes/:id", requireAuth, async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      if (req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        const companyUsers2 = await storage.getCompanyUsersByUserId(req.session.userId);
        const isMember = companyUsers2.some((cu) => cu.companyId === quote.companyId);
        if (!isMember) {
          return res.status(403).json({ error: "Access denied" });
        }
        const allowedUpdates = ["status"];
        const updates2 = {};
        if (req.body.status && ["accepted", "rejected"].includes(req.body.status)) {
          updates2.status = req.body.status;
        }
        const updatedQuote2 = await storage.updateQuote(req.params.id, updates2);
        return res.json(updatedQuote2);
      }
      const updates = {};
      if (req.body.status) updates.status = req.body.status;
      if (req.body.validUntil) updates.validUntil = new Date(req.body.validUntil);
      const validatePricing = (value, fieldName) => {
        if (value === void 0 || value === null) return null;
        if (value === "") {
          return `${fieldName} cannot be empty`;
        }
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
          return `${fieldName} must be a valid number`;
        }
        if (parsed < 0) {
          return `${fieldName} cannot be negative`;
        }
        return null;
      };
      const errors = [];
      if (req.body.subtotal !== void 0) {
        const error = validatePricing(req.body.subtotal, "Subtotal");
        if (error) errors.push(error);
        else updates.subtotal = parseFloat(req.body.subtotal).toFixed(2);
      }
      if (req.body.shippingEstimate !== void 0) {
        const error = validatePricing(req.body.shippingEstimate, "Shipping estimate");
        if (error) errors.push(error);
        else updates.shippingEstimate = parseFloat(req.body.shippingEstimate).toFixed(2);
      }
      if (req.body.taxEstimate !== void 0) {
        const error = validatePricing(req.body.taxEstimate, "Tax estimate");
        if (error) errors.push(error);
        else updates.taxEstimate = parseFloat(req.body.taxEstimate).toFixed(2);
      }
      if (req.body.totalEstimate !== void 0) {
        const error = validatePricing(req.body.totalEstimate, "Total estimate");
        if (error) errors.push(error);
        else updates.totalEstimate = parseFloat(req.body.totalEstimate).toFixed(2);
      }
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(", ") });
      }
      if (updates.status === "sent") {
        const finalSubtotal = updates.subtotal || quote.subtotal;
        const finalTotal = updates.totalEstimate || quote.totalEstimate;
        if (parseFloat(finalTotal) <= 0) {
          return res.status(400).json({
            error: "Cannot send quote without valid pricing. Total estimate must be greater than 0."
          });
        }
      }
      const updatedQuote = await storage.updateQuote(req.params.id, updates);
      await storage.createAuditLog({
        actorUserId: req.session.userId,
        companyId: quote.companyId,
        action: "quote_updated",
        entityType: "quote",
        entityId: req.params.id,
        newValues: JSON.stringify(updates)
      });
      res.json(updatedQuote);
    } catch (error) {
      console.error("Update quote error:", error);
      res.status(500).json({ error: "Failed to update quote" });
    }
  });
  app2.get("/api/admin/quotes", requireAdmin, async (req, res) => {
    try {
      const companies2 = await storage.getAllCompanies();
      const allQuotes = await Promise.all(
        companies2.map(async (company) => {
          const quotes2 = await storage.getQuotesByCompanyId(company.id);
          return quotes2.map((quote) => ({ ...quote, company }));
        })
      );
      res.json(allQuotes.flat());
    } catch (error) {
      console.error("Get all quotes error:", error);
      res.status(500).json({ error: "Failed to get quotes" });
    }
  });
  app2.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const orders2 = await storage.getAllOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Get all orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });
  app2.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const updates = {};
      if (status) updates.status = status;
      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      await storage.createAuditLog({
        actorUserId: req.session.userId,
        action: "order_updated",
        entityType: "order",
        entityId: req.params.id,
        newValues: JSON.stringify(updates)
      });
      res.json(order);
    } catch (error) {
      console.error("Update order error:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });
  app2.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });
  app2.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { role, isActive } = req.body;
      const updates = {};
      if (role) updates.role = role;
      if (isActive !== void 0) updates.isActive = isActive;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await storage.createAuditLog({
        actorUserId: req.session.userId,
        action: "user_updated",
        entityType: "user",
        entityId: req.params.id,
        newValues: JSON.stringify(updates)
      });
      res.json(user);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  app2.get("/api/saved-lists", requireAuth, async (req, res) => {
    try {
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext) {
        return res.status(400).json({ error: "User does not belong to a company" });
      }
      const lists = await storage.getSavedListsByCompanyId(companyContext.companyId);
      res.json(lists);
    } catch (error) {
      console.error("Get saved lists error:", error);
      res.status(500).json({ error: "Failed to get saved lists" });
    }
  });
  app2.post("/api/saved-lists", requireAuth, async (req, res) => {
    try {
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext) {
        return res.status(400).json({ error: "User does not belong to a company" });
      }
      const parsed = insertSavedListSchema.safeParse({
        ...req.body,
        companyId: companyContext.companyId,
        createdByUserId: req.session.userId
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const list = await storage.createSavedList(parsed.data);
      await storage.createAuditLog({
        actorUserId: req.session.userId,
        companyId: companyContext.companyId,
        action: "saved_list_created",
        entityType: "saved_list",
        entityId: list.id,
        newValues: JSON.stringify(list)
      });
      res.json(list);
    } catch (error) {
      console.error("Create saved list error:", error);
      res.status(500).json({ error: "Failed to create saved list" });
    }
  });
  app2.get("/api/saved-lists/:id", requireAuth, async (req, res) => {
    try {
      const list = await storage.getSavedList(req.params.id);
      if (!list) {
        return res.status(404).json({ error: "Saved list not found" });
      }
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext || list.companyId !== companyContext.companyId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const items = await storage.getSavedListItems(req.params.id);
      res.json({ ...list, items });
    } catch (error) {
      console.error("Get saved list error:", error);
      res.status(500).json({ error: "Failed to get saved list" });
    }
  });
  app2.delete("/api/saved-lists/:id", requireAuth, async (req, res) => {
    try {
      const list = await storage.getSavedList(req.params.id);
      if (!list) {
        return res.status(404).json({ error: "Saved list not found" });
      }
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext || list.companyId !== companyContext.companyId) {
        return res.status(403).json({ error: "Access denied" });
      }
      await storage.deleteSavedList(req.params.id);
      await storage.createAuditLog({
        actorUserId: req.session.userId,
        companyId: companyContext.companyId,
        action: "saved_list_deleted",
        entityType: "saved_list",
        entityId: req.params.id
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete saved list error:", error);
      res.status(500).json({ error: "Failed to delete saved list" });
    }
  });
  app2.post("/api/saved-lists/:id/items", requireAuth, async (req, res) => {
    try {
      const list = await storage.getSavedList(req.params.id);
      if (!list) {
        return res.status(404).json({ error: "Saved list not found" });
      }
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext || list.companyId !== companyContext.companyId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const parsed = insertSavedListItemSchema.safeParse({
        ...req.body,
        savedListId: req.params.id
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const item = await storage.addSavedListItem(parsed.data);
      res.json(item);
    } catch (error) {
      console.error("Add saved list item error:", error);
      res.status(500).json({ error: "Failed to add item to saved list" });
    }
  });
  app2.delete("/api/saved-lists/:listId/items/:itemId", requireAuth, async (req, res) => {
    try {
      const list = await storage.getSavedList(req.params.listId);
      if (!list) {
        return res.status(404).json({ error: "Saved list not found" });
      }
      const companyContext = await getUserPrimaryCompany(req.session.userId);
      if (!companyContext || list.companyId !== companyContext.companyId) {
        return res.status(403).json({ error: "Access denied" });
      }
      await storage.deleteSavedListItem(req.params.itemId);
      res.json({ success: true });
    } catch (error) {
      console.error("Remove saved list item error:", error);
      res.status(500).json({ error: "Failed to remove item from saved list" });
    }
  });
  app2.get("/api/faqs", async (req, res) => {
    try {
      const faqs2 = await storage.getAllFaqs();
      res.json(faqs2);
    } catch (error) {
      console.error("Get FAQs error:", error);
      res.status(500).json({ error: "Failed to get FAQs" });
    }
  });
  app2.post("/api/support/tickets", async (req, res) => {
    try {
      const { name, email, company, subject, message } = req.body;
      const ticket = await storage.createSupportTicket({
        companyId: req.session.userId ? void 0 : null,
        createdByUserId: req.session.userId || null,
        subject,
        description: `From: ${name} (${email})
Company: ${company || "N/A"}

${message}`,
        status: "open",
        priority: "medium"
      });
      res.json(ticket);
    } catch (error) {
      console.error("Create ticket error:", error);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
