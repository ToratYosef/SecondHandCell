import { NextResponse } from 'next/server';
import { requireAdminToken } from '@/services/wholesale';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    await requireAdminToken(request);
    const ref = firestore.collection('wholesaleOrders').doc(params.orderId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    const label = { id: `${params.orderId}-label`, url: 'https://example.com/wholesale-label.pdf' };
    await ref.update({ label, updatedAt: new Date().toISOString() });
    return NextResponse.json({ label });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
