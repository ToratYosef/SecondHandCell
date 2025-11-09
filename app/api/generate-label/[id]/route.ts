import { NextResponse } from 'next/server';
import { assertRole, getAuthContext } from '@/lib/auth';
import { generateInboundLabel } from '@/services/labels';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    await generateInboundLabel(params.id, context.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
