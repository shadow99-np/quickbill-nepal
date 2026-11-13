import { NextResponse } from 'next/server';
import { getUserByToken, getUserCatalog, addCatalogItem, deleteCatalogItem } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    // If logged in, get user's catalog; if guest, get default sample items
    const userId = user?.id || 'admin_1';
    const items = getUserCatalog(userId);

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Please log in to save items to your catalog' }, { status: 401 });
    }

    const body = await request.json();
    const { name, rate, unit, category } = body;

    if (!name || rate === undefined) {
      return NextResponse.json({ error: 'Item name and rate are required' }, { status: 400 });
    }

    const newItem = addCatalogItem(user.id, {
      name: name.trim(),
      rate: Number(rate) || 0,
      unit: unit || 'pcs',
      category: category || 'General',
    });

    return NextResponse.json({
      success: true,
      item: newItem,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    deleteCatalogItem(user.id, id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
