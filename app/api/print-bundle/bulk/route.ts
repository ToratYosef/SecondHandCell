import { NextResponse } from 'next/server';
import { getAuthContext, assertRole } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ orderIds: z.array(z.string()).min(1) });

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const body = await request.json();
    const { orderIds } = schema.parse(body);
    const buffer = Buffer.from(`Bulk bundle for orders ${orderIds.join(',')}`);
    return new NextResponse(buffer, { headers: { 'Content-Type': 'application/pdf' } });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
