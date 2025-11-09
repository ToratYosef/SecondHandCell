import { firestore } from '@/lib/firebaseAdmin';

async function main() {
  const batch = firestore.batch();
  const adminId = 'admin-demo';
  batch.set(firestore.collection('admins').doc(adminId), {
    email: 'admin@secondhandcell.test',
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  const orderRef = firestore.collection('orders').doc('seed-order');
  batch.set(orderRef, {
    id: 'seed-order',
    orderNumber: 'SHC-00001',
    userId: 'user-demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shippingInfo: {
      name: 'Demo Customer',
      email: 'customer@example.com',
      phone: '+1-555-0100',
      address: '123 Demo St',
      city: 'Demo City',
      state: 'CA',
      postalCode: '94016',
      country: 'US'
    },
    device: {
      brand: 'Apple',
      model: 'iPhone 14',
      storage: '128GB',
      condition: 'Good'
    },
    payment: {
      method: 'PayPal',
      status: 'pending'
    },
    statusTimeline: [
      { status: 'submitted', actor: 'user-demo', timestamp: new Date().toISOString() }
    ],
    labels: [],
    activityLogs: []
  });

  batch.set(firestore.collection('users').doc('user-demo').collection('orders').doc('seed-order'), {
    id: 'seed-order',
    orderNumber: 'SHC-00001',
    mirroredAt: new Date().toISOString()
  });

  const inventory = firestore.collection('wholesaleInventory');
  ['Pixel 7', 'Galaxy S23', 'iPhone 13'].forEach((name, index) => {
    batch.set(inventory.doc(`item-${index}`), {
      id: `item-${index}`,
      title: name,
      sku: `SKU-${index}`,
      price: 299 + index * 25,
      stock: 10 + index * 5
    });
  });

  batch.set(firestore.collection('adminAuditLogs').doc(), {
    actor: 'system',
    action: 'seed',
    orderId: 'seed-order',
    timestamp: new Date().toISOString()
  });

  await batch.commit();
  console.log('Seed data written');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
