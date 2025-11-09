import { NextResponse } from 'next/server';
import { appendActivity } from '@/services/orderActions';
import { getAuthContext } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ orderId: z.string().min(1), message: z.string().optional() });

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const data = schema.parse(body);
    await appendActivity(data.orderId, context.uid, 'order.offer.return', { message: data.message ?? null });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
