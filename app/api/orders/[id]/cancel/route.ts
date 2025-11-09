import { NextResponse } from 'next/server';
import { assertRole, getAuthContext } from '@/lib/auth';
import { appendActivity } from '@/services/orderActions';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    await appendActivity(params.id, context.uid, 'order.cancelled');
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
