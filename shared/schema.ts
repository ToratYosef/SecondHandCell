import { z } from "zod";

export const userRoleEnum = ["buyer", "admin", "super_admin"] as const;
export const quoteStatusEnum = ["draft", "sent", "accepted", "rejected", "expired"] as const;

export type User = {
  id: string;
  name?: string;
  email?: string;
  role: (typeof userRoleEnum)[number];
  companyId?: string | null;
  companyName?: string | null;
  createdAt?: string | number | Date;
};

export type Company = {
  id: string;
  name: string;
  legalName?: string | null;
  contactEmail?: string | null;
  status?: string;
};

export type Quote = {
  id: string;
  quoteNumber: string;
  status: (typeof quoteStatusEnum)[number];
  companyId?: string | null;
  company?: Company;
  subtotal?: number | string | null;
  shippingEstimate?: number | string | null;
  taxEstimate?: number | string | null;
  totalEstimate?: number | string | null;
  createdAt?: string | number | Date;
};

export type Order = {
  id: string;
  orderNumber?: string;
  status?: string;
  total?: number | string;
  createdAt?: string | number | Date;
  company?: Company;
};

export type SavedListItem = {
  id: string;
  savedListId?: string;
  deviceVariantId?: string;
  defaultQuantity?: number;
};

export type SavedList = {
  id: string;
  userId?: string;
  name: string;
  items?: SavedListItem[];
  createdAt?: string | number | Date;
};

export const insertSavedListSchema = z.object({
  name: z.string().min(1, "List name is required"),
});

export type InsertSavedList = z.infer<typeof insertSavedListSchema>;

export type DeviceVariant = {
  id: string;
  deviceModelId?: string;
  sku?: string;
  color?: string;
  storage?: string;
  condition?: string;
  price?: number;
  available?: number;
  status?: string;
  imageUrl?: string | null;
};

export type CatalogItem = {
  id: string;
  model: string;
  brand?: string;
  slug?: string;
  storage?: string;
  condition?: string;
  price?: number;
  status?: string;
  imageUrl?: string | null;
  updatedAt?: string | number | Date;
};

export type WholesaleApplication = {
  id?: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  passwordDigest?: string | null;
  companyName: string;
  legalName?: string;
  website?: string;
  taxId?: string;
  businessType: string;
  resellerCertificateName?: string | null;
  contactName: string;
  addressPhone: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  status?: "submitted" | "in_review" | "approved" | "rejected";
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};
