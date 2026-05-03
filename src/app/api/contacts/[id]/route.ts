import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { contactService } from '@/services/contact.service';
import { ContactSchema } from '@/lib/schema';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const contact = await contactService.findById(id);
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success){
    return NextResponse.json(
      { error: 'Validation échouée', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  return NextResponse.json(await contactService.update(id, parsed.data));
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await contactService.delete(id);
  return NextResponse.json({ ok: true });
}