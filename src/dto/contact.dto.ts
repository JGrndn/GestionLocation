import { LocationDTO } from "./location.dto";

export type ContactDTO = {
  id: string;
  prenom: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  locations: LocationDTO[];
  createdAt: string;
  updatedAt: string;
};