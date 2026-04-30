export function calcLocation(loc: {
  dateArrivee: string;
  depart: string;
  adultes: number;
  prixBase: number;
  taxeParNuit: number;
  frais: number;
  acompte: number;
}) {
  const n = Math.max(0, Math.round(
    (new Date(loc.depart).getTime() - new Date(loc.dateArrivee).getTime()) / 86400000
  ));
  const taxeTotale = Number(loc.taxeParNuit) * Number(loc.adultes) * n;
  const frais = Number(loc.frais);
  const prixTotal = Number(loc.prixBase) + frais + taxeTotale;
  const solde = prixTotal - Number(loc.acompte);
  return { n, taxeTotale, frais, prixTotal, solde };
}

export function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('fr-FR');
}

export function money(v: number) {
  return v.toFixed(2) + ' €';
}