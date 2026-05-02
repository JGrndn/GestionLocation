import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { contactService } from '@/services/contact.service';
import { ContactInput, ContactSchema } from '@/lib/schema';

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await contactService.findAllLight());
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await req.json();
  const parsed = ContactSchema.parse(body)
  return NextResponse.json(await contactService.create(parsed), { status: 201 });
}