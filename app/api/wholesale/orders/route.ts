import { NextResponse } from 'next/server';
import { requireAdminToken } from '@/services/wholesale';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    await requireAdminToken(request);
    const snapshot = await firestore.collection('wholesaleOrders').get();
    return NextResponse.json({ orders: snapshot.docs.map((doc) => doc.data()) });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
