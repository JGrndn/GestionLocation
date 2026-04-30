import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locationService } from '@/services/location.service';

type Params = { params: Promise<{ id: string; locId: string }> };

export async function PUT(req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;
  return NextResponse.json(await locationService.update(locId, await req.json()));
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;
  await locationService.delete(locId);
  return NextResponse.json({ ok: true });
}