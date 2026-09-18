import type { Contact, Location } from '@/generated/prisma/client';
import type { ContactDTO } from './contact.dto';
import type { ContactInput } from './contact.schema';
import { toLocationDTO } from '@/modules/location';

// `locations` n'est présent que lorsqu'il est inclus dans la requête Prisma
// (findForPdf, p.ex., ne charge que le contact). D'où le champ optionnel.
type ContactWithLocations = Contact & { locations?: Location[] };

export function toContactDTO(contact: ContactWithLocations): ContactDTO {
  return {
    id: contact.id,
    prenom: contact.prenom,
    nom: contact.nom,
    email: contact.email,
    telephone: contact.telephone,
    adresse: contact.adresse,
    locations: (contact.locations ?? []).map(toLocationDTO),
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export function fromContactInput(body: ContactInput) {
  return {
    prenom: body.prenom,
    nom: body.nom,
    email: body.email || null,
    telephone: body.telephone || null,
    adresse: body.adresse || null,
  };
}