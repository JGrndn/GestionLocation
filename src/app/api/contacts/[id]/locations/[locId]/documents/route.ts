import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { documentService } from '@/services/document.service';

// pdf-lib manipule le PDF côté serveur : runtime Node requis.
export const runtime = 'nodejs';

type Params = { params: Promise<{ locId: string }> };

export async function POST(req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Le fichier doit être un PDF' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  await documentService.saveTenantSigned(locId, bytes, file.name || `contrat_${locId}.pdf`);

  try {
    await documentService.countersign(locId);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erreur lors de la contre-signature' },
      { status: 422 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;
  await documentService.deleteForLocation(locId);
  return NextResponse.json({ ok: true });
}
