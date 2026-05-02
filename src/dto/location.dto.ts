export type LocationDTO = {
  id: string;
  contactId: string;
  dateArrivee: string;
  depart: string;
  adultes: number;
  enfants: number;
  animaux: number;
  prixBase: number;
  taxeParNuit: number;
  frais: number;
  acompte: number;
  caution: number;
  langue: string; // "fr" | "en"
  createdAt: string;
  updatedAt: string;
};