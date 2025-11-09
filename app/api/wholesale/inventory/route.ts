import { NextResponse } from 'next/server';
import { listWholesaleInventory } from '@/services/wholesale';

export async function GET() {
  const items = await listWholesaleInventory();
  return NextResponse.json({ items });
}
