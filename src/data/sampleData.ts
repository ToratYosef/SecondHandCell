import { DeviceCondition, PaymentMethod, type OrderRecord } from '@/types/orders';
import type { WholesaleItem } from '@/types/wholesale';

const now = new Date();
function daysAgo(days: number) {
  const copy = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return copy.toISOString();
}

export const demoOrders: OrderRecord[] = [
  {
    id: 'demo-1',
    orderNumber: 'SHC-00001',
    userId: 'guest',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    shippingInfo: {
      name: 'Jordan Winters',
      email: 'jordan@example.com',
      phone: '+1-555-210-9898',
      address: '221 Market Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US'
    },
    device: {
      brand: 'Apple',
      model: 'iPhone 16',
      storage: '256GB',
      condition: DeviceCondition.Flawless,
      imei: ''
    },
    payment: {
      method: PaymentMethod.PayPal,
      status: 'pending',
      email: 'payouts@example.com'
    },
    statusTimeline: [
      { status: 'submitted', timestamp: daysAgo(1), actor: 'guest' }
    ],
    labels: [],
    activityLogs: [
      {
        actor: 'guest',
        action: 'order.created',
        timestamp: daysAgo(1),
        context: { quotedAmount: 680 }
      }
    ]
  },
  {
    id: 'demo-2',
    orderNumber: 'SHC-00002',
    userId: 'user-42',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1.5),
    shippingInfo: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+1-555-313-1122',
      address: '88 Battery Place',
      city: 'New York',
      state: 'NY',
      postalCode: '10280',
      country: 'US'
    },
    device: {
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      storage: '512GB',
      condition: DeviceCondition.Good,
      imei: ''
    },
    payment: {
      method: PaymentMethod.Zelle,
      status: 'pending'
    },
    statusTimeline: [
      { status: 'submitted', timestamp: daysAgo(2), actor: 'user-42' },
      { status: 'kit-sent', timestamp: daysAgo(1.6), actor: 'ops' }
    ],
    labels: [],
    activityLogs: [
      {
        actor: 'ops',
        action: 'order.status.update',
        timestamp: daysAgo(1.6),
        context: { status: 'kit-sent' }
      }
    ]
  },
  {
    id: 'demo-3',
    orderNumber: 'SHC-00003',
    userId: 'guest',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(4.8),
    shippingInfo: {
      name: 'Morgan Lee',
      email: 'morgan@example.com',
      phone: '+1-555-422-8899',
      address: '512 North Avenue',
      city: 'Austin',
      state: 'TX',
      postalCode: '73301',
      country: 'US'
    },
    device: {
      brand: 'Google',
      model: 'Pixel 9 Pro',
      storage: '128GB',
      condition: DeviceCondition.Fair,
      imei: ''
    },
    payment: {
      method: PaymentMethod.Check,
      status: 'pending',
      mailingAddress: '512 North Avenue, Austin TX 73301'
    },
    statusTimeline: [
      { status: 'submitted', timestamp: daysAgo(5), actor: 'guest' },
      { status: 'received', timestamp: daysAgo(4.9), actor: 'ops' }
    ],
    labels: [],
    activityLogs: [
      {
        actor: 'ops',
        action: 'order.status.update',
        timestamp: daysAgo(4.9),
        context: { status: 'received' }
      }
    ]
  }
];

export const demoWholesaleInventory: WholesaleItem[] = [
  {
    id: 'sample-iphone-16',
    title: 'iPhone 16 (Unlocked)',
    sku: 'APL-IP16-UNL-256',
    price: 785,
    stock: 18,
    imageUrl: '/images/devices/iphone-16.png'
  },
  {
    id: 'sample-s24',
    title: 'Samsung Galaxy S24 Ultra',
    sku: 'SMS-S24U-ATT-512',
    price: 865,
    stock: 11,
    imageUrl: '/images/devices/galaxy-s24-ultra.png'
  },
  {
    id: 'sample-pixel',
    title: 'Google Pixel 9 Pro',
    sku: 'GGL-PX9P-FI-256',
    price: 655,
    stock: 24,
    imageUrl: '/images/devices/pixel-9-pro.png'
  }
];
