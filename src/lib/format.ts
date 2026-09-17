export function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('fr-FR');
}

export function money(v: number) {
  return v.toFixed(2) + ' €';
}
