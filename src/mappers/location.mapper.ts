import type { Location } from '@/generated/prisma/client';
import type { LocationDTO, LocationFormDTO } from '@/dto/location.dto';

export function toLocationDTO(loc: Location): LocationDTO {
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
    createdAt: loc.createdAt.toISOString(),
    updatedAt: loc.updatedAt.toISOString(),
  };
}

export function fromLocationFormDTO(body: LocationFormDTO) {
  return {
    dateArrivee: new Date(body.dateArrivee),
    depart: new Date(body.depart),
    adultes: parseInt(body.adultes) || 1,
    enfants: parseInt(body.enfants) || 0,
    animaux: parseInt(body.animaux) || 0,
    prixBase: parseFloat(body.prixBase) || 0,
    taxeParNuit: parseFloat(body.taxeParNuit) || 0,
    frais: parseFloat(body.frais) || 0,
    acompte: parseFloat(body.acompte) || 0,
    caution: parseFloat(body.caution) || 0,
  };
}