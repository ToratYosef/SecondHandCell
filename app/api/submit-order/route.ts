import { NextResponse } from 'next/server';
import { createOrder } from '@/services/orders';
import { getAuthContext } from '@/lib/auth';
import { submitOrderSchema } from '@/types/orders';
import { notifyAdmins, notifyOrderSubmission } from '@/services/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = submitOrderSchema.parse(body);
    const context = await getAuthContext();

    const { id, orderNumber } = await createOrder(data, context?.uid ?? null);

    await Promise.allSettled([
      notifyAdmins('New order submitted', { orderNumber, orderId: id }),
      notifyOrderSubmission(orderNumber, data.shippingInfo.email)
    ]);

    return NextResponse.json({ orderId: id, orderNumber }, { status: 201 });
  } catch (error) {
    console.error(error);
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
