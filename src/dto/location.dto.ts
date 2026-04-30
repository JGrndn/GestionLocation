export type LocationDTO = {
  id: string;
  contactId: string;
  dateArrivee: string;   // ISO string
  depart: string;
  adultes: number;
  enfants: number;
  animaux: number;
  prixBase: number;
  taxeParNuit: number;
  frais: number;
  acompte: number;
  caution: number;
  createdAt: string;
  updatedAt: string;
};

export type LocationFormDTO = {
  dateArrivee: string;
  depart: string;
  adultes: string;
  enfants: string;
  animaux: string;
  prixBase: string;
  taxeParNuit: string;
  frais: string;
  acompte: string;
  caution: string;
};