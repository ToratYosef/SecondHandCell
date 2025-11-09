import { NextResponse } from 'next/server';
import { getOrderById } from '@/services/orders';
import { getAuthContext, assertRole } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (context?.uid !== order.userId) {
      assertRole(context, 'admin');
    }

    return NextResponse.json(order);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
