import { z } from 'zod';

export enum DeviceCondition {
  Flawless = 'Flawless',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor'
}

export enum PaymentMethod {
  PayPal = 'PayPal',
  Venmo = 'Venmo',
  Check = 'Check',
  Zelle = 'Zelle'
}

export const shippingInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2)
});

export const deviceSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  storage: z.string().min(1),
  condition: z.nativeEnum(DeviceCondition),
  imei: z.string().optional().nullable(),
  carrier: z.string().optional().nullable()
});

export const paymentSchema = z.object({
  method: z.nativeEnum(PaymentMethod),
  email: z.string().email().optional().nullable(),
  venmoHandle: z.string().optional().nullable(),
  mailingAddress: z.string().optional().nullable()
});

export const submitOrderSchema = z.object({
  userToken: z.string().optional().nullable(),
  shippingInfo: shippingInfoSchema,
  device: deviceSchema,
  payment: paymentSchema,
  shippingPreference: z.enum(['kit', 'self-ship']),
  quotedAmount: z.number().nonnegative(),
  notes: z.string().max(2000).optional().nullable()
});

export type SubmitOrderRequest = z.infer<typeof submitOrderSchema>;

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  shippingInfo: SubmitOrderRequest['shippingInfo'];
  device: SubmitOrderRequest['device'];
  payment: SubmitOrderRequest['payment'] & {
    status: 'pending' | 'paid' | 'void';
    stripePaymentIntentId?: string;
  };
  statusTimeline: Array<{ status: string; timestamp: string; actor: string }>;
  labels: Array<{
    labelId: string;
    carrier: string;
    tracking: string;
    url: string;
    metadata?: Record<string, unknown>;
  }>;
  reOffer?: {
    currentOffer: number;
    history: Array<{ amount: number; status: 'accepted' | 'declined'; timestamp: string }>;
  };
  activityLogs: Array<{ actor: string; action: string; timestamp: string; context?: Record<string, unknown> }>;
}

export const orderStatusSchema = z.object({
  status: z.string().min(1),
  reason: z.string().optional(),
  notifyCustomer: z.boolean().optional().default(false)
});

export type OrderStatusUpdate = z.infer<typeof orderStatusSchema>;
