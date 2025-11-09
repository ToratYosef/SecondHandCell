import { NextResponse } from 'next/server';
import { getAuthContext, assertRole } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const buffer = Buffer.from(`Bundle for order ${params.id}`);
    return new NextResponse(buffer, { headers: { 'Content-Type': 'application/pdf' } });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
