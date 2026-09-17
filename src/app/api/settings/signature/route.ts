import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { documentService } from '@/modules/contract';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
  }
  if (file.type !== 'image/png') {
    return NextResponse.json({ error: 'La signature doit être une image PNG' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  await documentService.saveOwnerSignature(bytes, file.type);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sig = await documentService.getOwnerSignature();
  if (!sig) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return new NextResponse(new Uint8Array(sig.content), {
    headers: { 'Content-Type': sig.mimeType, 'Cache-Control': 'no-store' },
  });
}
