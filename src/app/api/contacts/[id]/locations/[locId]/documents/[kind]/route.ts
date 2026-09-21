import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { contentDisposition } from '@/lib/http';
import { documentService, type DocumentKind } from '@/modules/contract';

export const runtime = 'nodejs';

type Params = { params: Promise<{ locId: string; kind: string }> };

const KIND_MAP: Record<string, DocumentKind> = {
  'tenant-signed': 'TENANT_SIGNED',
  countersigned: 'COUNTERSIGNED',
};

export async function GET(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId, kind } = await params;

  const mapped = KIND_MAP[kind];
  if (!mapped) return NextResponse.json({ error: 'Type de document inconnu' }, { status: 400 });

  const doc = await documentService.getDocument(locId, mapped);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return new NextResponse(new Uint8Array(doc.content), {
    headers: {
      'Content-Type': doc.mimeType,
      'Content-Disposition': contentDisposition(doc.filename),
    },
  });
}
