import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locationService } from '@/services/location.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  return NextResponse.json(await locationService.findAllForContact(id));
}

export async function POST(req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  return NextResponse.json(await locationService.create(id, await req.json()), { status: 201 });
}