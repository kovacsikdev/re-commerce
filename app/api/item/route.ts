import { NextResponse } from 'next/server';
import { fetchServerItemById } from '../../../src/lib/server-product-api';

export const POST = async (request: Request) => {
  const body = (await request.json()) as { itemId?: string };
  const itemId = body.itemId?.trim();

  if (!itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
  }

  const item = await fetchServerItemById(itemId);

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json(item);
};