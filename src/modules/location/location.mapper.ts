import type { Location } from '@/generated/prisma/client';
import type { LocationDTO } from './location.dto';
import type { LocationInput } from './location.schema';

// `documents` n'est présent que lorsqu'il est inclus dans la requête Prisma.
type LocationWithDocs = Location & { documents?: { kind: string }[] };

export function toLocationDTO(loc: LocationWithDocs): LocationDTO {
  const kinds = loc.documents?.map((d) => d.kind) ?? [];
  return {
    id: loc.id,
    contactId: loc.contactId,
    dateArrivee: loc.dateArrivee.toISOString(),
    depart: loc.depart.toISOString(),
    adultes: loc.adultes,
    enfants: loc.enfants,
    animaux: loc.animaux,
    prixBase: Number(loc.prixBase),
    taxeParNuit: Number(loc.taxeParNuit),
    frais: Number(loc.frais),
    acompte: Number(loc.acompte),
    caution: Number(loc.caution),
    langue: (loc as any).langue ?? 'fr',
    hasTenantSigned: kinds.includes('TENANT_SIGNED'),
    hasCountersigned: kinds.includes('COUNTERSIGNED'),
    createdAt: loc.createdAt.toISOString(),
    updatedAt: loc.updatedAt.toISOString(),
  };
}

export function fromLocationInput(body: LocationInput) {
  return {
    dateArrivee: new Date(body.dateArrivee),
    depart: new Date(body.depart),
    adultes: body.adultes || 1,
    enfants: body.enfants || 0,
    animaux: body.animaux || 0,
    prixBase: body.prixBase || 0,
    taxeParNuit: body.taxeParNuit || 0,
    frais: body.frais || 0,
    acompte: body.acompte || 0,
    caution: body.caution || 0,
    langue: body.langue ?? 'fr',
  };
}