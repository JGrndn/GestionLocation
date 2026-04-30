export type Location = {
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
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  prenom: string;
  nom: string;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  locations: Location[];
  createdAt: string;
  updatedAt: string;
};

export type LocationFormData = {
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

export type ContactFormData = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
};

export function calcLocation(loc: Pick<Location, "dateArrivee" | "depart" | "adultes" | "prixBase" | "taxeParNuit" | "frais" | "acompte">) {
  const da = new Date(loc.dateArrivee);
  const dd = new Date(loc.depart);
  const n = Math.max(0, Math.round((dd.getTime() - da.getTime()) / 86400000));
  const taxeTotale = Number(loc.taxeParNuit) * Number(loc.adultes) * n;
  const frais = Number(loc.frais);
  const prixTotal = Number(loc.prixBase) + frais + taxeTotale;
  const solde = prixTotal - Number(loc.acompte);
  return { n, taxeTotale, frais, prixTotal, solde };
}

export function fmtDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR");
}

export function money(v: number) {
  return v.toFixed(2) + " €";
}
