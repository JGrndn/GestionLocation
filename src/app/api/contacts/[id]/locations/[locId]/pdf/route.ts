import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locationService } from '@/services/location.service';
import { renderToBuffer } from '@react-pdf/renderer';
import { LocationDocument } from '@/components/pdf/LocationDocument';
import React from 'react';

type Params = { params: Promise<{ locId: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { locId } = await params;

  const location = await locationService.findForPdf(locId);

  if (!location || !location.contact) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { contact } = location;

  const element = React.createElement(LocationDocument, {
    contact,
    location: {
      ...location,
      dateArrivee: location.dateArrivee.toISOString(),
      depart: location.depart.toISOString(),
      prixBase: Number(location.prixBase),
      taxeParNuit: Number(location.taxeParNuit),
      frais: Number(location.frais),
      acompte: Number(location.acompte),
      caution: Number(location.caution),
    },
  }) as React.ReactElement<import('@react-pdf/renderer').DocumentProps>;

  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="location_${contact.nom}_${location.dateArrivee.toISOString().slice(0, 10)}.pdf"`,
    },
  });
}