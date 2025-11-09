import { NextResponse } from 'next/server';
import { listOrders } from '@/services/orders';
import { assertRole, getAuthContext } from '@/lib/auth';

export async function GET() {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
