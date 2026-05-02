import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locationService } from '@/services/location.service';
import { LocationSchema } from '@/lib/schema';

type Params = { params: Promise<{ id: string; locId: string }> };

export async function PUT(req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;
  const body = await req.json();
  const parsed = LocationSchema.parse(body);
  return NextResponse.json(await locationService.update(locId, parsed));
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;
  await locationService.delete(locId);
  return NextResponse.json({ ok: true });
}