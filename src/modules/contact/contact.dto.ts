import type { LocationDTO } from "@/modules/location";

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

// Vue allégée servie par la liste des contacts (GET /api/contacts) : seuls les
// champs réellement affichés, sans les locations imbriquées. Contrat honnête
// pour findAllLight, distinct du ContactDTO complet.
export type ContactSummary = Pick<
  ContactDTO,
  'id' | 'prenom' | 'nom' | 'email' | 'telephone'
>;