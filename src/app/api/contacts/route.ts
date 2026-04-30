import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { contactService } from '@/services/contact.service';

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await contactService.findAll());
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  return NextResponse.json(await contactService.create(body), { status: 201 });
}