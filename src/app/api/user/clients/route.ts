import { NextResponse } from 'next/server';
import { getUserByToken, getUserClients, saveUserClient } from '@/lib/db';
import { ClientProfile } from '@/types/invoice';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user) {
      return NextResponse.json({ clients: [] });
    }

    const clients = getUserClients(user.id);
    return NextResponse.json({ success: true, clients });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { client } = body as { client: ClientProfile };

    if (!client || !client.name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }

    const updatedClients = saveUserClient(user.id, client);
    return NextResponse.json({ success: true, clients: updatedClients });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 });
  }
}
