import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { createWholesaleCheckout } from '@/services/wholesale';
import { z } from 'zod';

const schema = z.object({
  items: z.array(z.object({ id: z.string().min(1), quantity: z.number().int().positive() })),
  currency: z.string().default('usd')
});

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const data = schema.parse(body);
    const payment = await createWholesaleCheckout(data, context.uid);
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
