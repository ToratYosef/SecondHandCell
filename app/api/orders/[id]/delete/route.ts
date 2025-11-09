import { NextResponse } from 'next/server';
import { assertRole, getAuthContext } from '@/lib/auth';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const ref = firestore.collection('orders').doc(params.id);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    const data = snapshot.data();
    await ref.delete();
    if (data?.userId) {
      await firestore.collection('users').doc(data.userId).collection('orders').doc(params.id).delete();
    }
    await firestore.collection('adminAuditLogs').doc().set({
      actor: context.uid,
      action: 'order.deleted',
      orderId: params.id,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
