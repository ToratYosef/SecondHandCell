import { NextResponse } from 'next/server';
import { assertRole, getAuthContext } from '@/lib/auth';
import { voidLabel } from '@/services/labels';
import { z } from 'zod';

const schema = z.object({ labelId: z.string().min(1) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const body = await request.json();
    const { labelId } = schema.parse(body);
    await voidLabel(params.id, labelId, context.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
