import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locationService, toLocationDTO } from '@/modules/location';
import { toContactDTO } from '@/modules/contact';
import { renderToBuffer } from '@react-pdf/renderer';
import { LocationDocument } from '@/modules/contract/pdf/LocationDocument';
import { LocationDocumentEN } from '@/modules/contract/pdf/LocationDocumentEN';
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
  const lang = new URL(_req.url).searchParams.get('lang') ?? location.langue ?? 'fr';

  // Réutilise les mappers du domaine plutôt que de dupliquer le mapping.
  // contact n'a pas ses locations chargées ici -> toContactDTO renvoie [].
  // Le param `lang` (query) l'emporte toujours sur la langue stockée.
  const contactData = toContactDTO(contact);
  const locationData = { ...toLocationDTO(location), langue: lang };

  const DocumentComponent = lang === 'en' ? LocationDocumentEN : LocationDocument;

  const element = React.createElement(DocumentComponent, {
    contact: contactData,
    location: locationData,
  }) as React.ReactElement<import('@react-pdf/renderer').DocumentProps>;

  const buffer = await renderToBuffer(element);

  // Horodate le dernier téléchargement du PDF vierge, en « fire-and-forget » :
  // on n'attend PAS l'écriture, pour qu'un souci de connexion à la base (requête
  // qui pend, pas seulement qui échoue) ne puisse jamais bloquer ni casser le
  // téléchargement. Le serveur est un process Node long-vivant, donc la promesse
  // s'exécute jusqu'au bout même sans await. Les erreurs sont loguées.
  locationService
    .markPdfGenerated(location.id)
    .catch((e) => console.error('markPdfGenerated a échoué', e));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="location_${contact.nom}_${location.dateArrivee.toISOString().slice(0, 10)}_${lang}.pdf"`,
    },
  });
}