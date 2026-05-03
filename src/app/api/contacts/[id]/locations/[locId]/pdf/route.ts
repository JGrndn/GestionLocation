import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locationService } from '@/services/location.service';
import { renderToBuffer } from '@react-pdf/renderer';
import { LocationDocument } from '@/components/pdf/LocationDocument';
import { LocationDocumentEN } from '@/components/pdf/LocationDocumentEN';
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

  // lang query param takes priority, falls back to stored langue field
  const lang = new URL(_req.url).searchParams.get('lang') ?? (location as any).langue ?? 'fr';

  const contactData = {
    id: contact.id,
    prenom: contact.prenom,
    nom: contact.nom,
    email: contact.email,
    telephone: contact.telephone,
    adresse: contact.adresse,
    locations: [],
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };

  const locationData = {
    id: location.id,
    contactId: location.contactId,
    dateArrivee: location.dateArrivee.toISOString(),
    depart: location.depart.toISOString(),
    adultes: location.adultes,
    enfants: location.enfants,
    animaux: location.animaux,
    prixBase: Number(location.prixBase),
    taxeParNuit: Number(location.taxeParNuit),
    frais: Number(location.frais),
    acompte: Number(location.acompte),
    caution: Number(location.caution),
    langue: lang,
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString(),
  };

  const DocumentComponent = lang === 'en' ? LocationDocumentEN : LocationDocument;

  const element = React.createElement(DocumentComponent, {
    contact: contactData,
    location: locationData,
  }) as React.ReactElement<import('@react-pdf/renderer').DocumentProps>;

  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="location_${contact.nom}_${location.dateArrivee.toISOString().slice(0, 10)}_${lang}.pdf"`,
    },
  });
}