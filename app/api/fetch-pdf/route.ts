import { NextResponse } from 'next/server';
import { getAuthContext, assertRole } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ url: z.string().url() });

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();
    assertRole(context, 'admin');
    const { searchParams } = new URL(request.url);
    const url = schema.parse({ url: searchParams.get('url') }).url;
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline'
      }
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json({ message: (error as Error).message }, { status });
  }
}
