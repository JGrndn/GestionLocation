import { PDFDocument } from 'pdf-lib';

/**
 * Cible d'estampage de la signature du propriétaire.
 * Coordonnées en points PDF, origine en bas à gauche de la page.
 *
 * Les valeurs par défaut visent la case "Le Propriétaire" du bloc signatures
 * du contrat généré par l'app (page 1, A4 portrait 595×842). Si le locataire
 * renvoie un PDF re-scanné avec une mise en page différente, ajuster ici.
 */
export type StampTarget = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Cibles par défaut du contrat généré par l'app :
//  - page 1 (A4 portrait 595×842) : case "Le Propriétaire", bas gauche.
//  - page 2 (A4 paysage 842×595)  : case "Le Bailleur (propriétaire)",
//    bloc signatures en bas de la colonne de droite.
export const DEFAULT_STAMP_TARGETS: StampTarget[] = [
  { pageIndex: 0, x: 60, y: 50, width: 150, height: 55 },
  { pageIndex: 1, x: 440, y: 40, width: 150, height: 50 },
];

/**
 * Charge un PDF et y appose l'image de signature (PNG) du propriétaire
 * à chaque cible, puis renvoie les octets du PDF contre-signé.
 * Fonction pure : les octets de signature sont fournis par l'appelant.
 *
 * La date n'est pas estampée : le contrat généré l'inscrit déjà en toutes
 * lettres ("Fait en deux exemplaires à … le …") juste avant chaque bloc
 * de signature.
 */
export async function countersignPdf(
  pdfBytes: Uint8Array,
  signaturePng: Uint8Array,
  opts?: { targets?: StampTarget[] },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const png = await pdf.embedPng(signaturePng);
  const targets = opts?.targets ?? DEFAULT_STAMP_TARGETS;
  const pages = pdf.getPages();

  for (const t of targets) {
    const page = pages[t.pageIndex];
    if (!page) continue;

    // Conserve le ratio de l'image dans la boîte cible.
    const dims = png.scaleToFit(t.width, t.height);
    page.drawImage(png, { x: t.x, y: t.y, width: dims.width, height: dims.height });
  }

  return pdf.save();
}
