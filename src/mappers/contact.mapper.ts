import type { Contact, Location } from '@/generated/prisma/client';
import type { ContactDTO, ContactFormDTO } from '@/dto/contact.dto';
import type { LocationDTO } from '@/dto/location.dto';
import { toLocationDTO } from './location.mapper';

type ContactWithLocations = Contact & { locations: Location[] };

export function toContactDTO(contact: ContactWithLocations): ContactDTO {
  return {
    id: contact.id,
    prenom: contact.prenom,
    nom: contact.nom,
    email: contact.email,
    telephone: contact.telephone,
    adresse: contact.adresse,
    locations: contact.locations.map(toLocationDTO),
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export function fromContactFormDTO(body: ContactFormDTO) {
  return {
    prenom: body.prenom,
    nom: body.nom,
    email: body.email || null,
    telephone: body.telephone || null,
    adresse: body.adresse || null,
  };
}