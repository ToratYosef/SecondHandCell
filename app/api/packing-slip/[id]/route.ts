import { NextResponse } from 'next/server';
import { getOrderById } from '@/services/orders';
import { getAuthContext, assertRole } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const pdfContent = Buffer.from(`Packing slip for ${order.orderNumber}`);
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf'
      }
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
