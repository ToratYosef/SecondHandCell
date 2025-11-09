import { NextResponse } from 'next/server';
import { getAuthContext, assertRole } from '@/lib/auth';
import { updateOrderStatus } from '@/services/orders';
import { orderStatusSchema } from '@/types/orders';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const body = await request.json();
    const data = orderStatusSchema.parse(body);
    await updateOrderStatus(params.id, data, context.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
