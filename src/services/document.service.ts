import { prisma } from '@/lib/prisma';
import { countersignPdf } from '@/lib/countersign';

export type DocumentKind = 'TENANT_SIGNED' | 'COUNTERSIGNED';

export const documentService = {
  /** Enregistre (ou remplace) le PDF signé par le locataire. */
  async saveTenantSigned(locId: string, bytes: Uint8Array, filename: string) {
    const content = Buffer.from(bytes);
    await prisma.contractDocument.upsert({
      where: { locationId_kind: { locationId: locId, kind: 'TENANT_SIGNED' } },
      create: { locationId: locId, kind: 'TENANT_SIGNED', content, filename, mimeType: 'application/pdf' },
      update: { content, filename },
    });
  },

  /**
   * Charge le PDF signé par le locataire + la signature du propriétaire,
   * appose la signature et enregistre le PDF contre-signé.
   */
  async countersign(locId: string) {
    const source = await prisma.contractDocument.findUnique({
      where: { locationId_kind: { locationId: locId, kind: 'TENANT_SIGNED' } },
    });
    if (!source) throw new Error('Aucun PDF signé par le locataire à contre-signer.');

    const signature = await prisma.ownerSignature.findUnique({ where: { id: 'owner' } });
    if (!signature) {
      throw new Error("Aucune signature du propriétaire configurée. Ajoutez-la dans les réglages.");
    }

    const signed = await countersignPdf(
      new Uint8Array(source.content),
      new Uint8Array(signature.content),
    );

    const content = Buffer.from(signed);
    const filename = source.filename.replace(/\.pdf$/i, '') + '_contre-signe.pdf';
    await prisma.contractDocument.upsert({
      where: { locationId_kind: { locationId: locId, kind: 'COUNTERSIGNED' } },
      create: { locationId: locId, kind: 'COUNTERSIGNED', content, filename, mimeType: 'application/pdf' },
      update: { content, filename },
    });
  },

  /** Renvoie un document (avec ses octets) pour une location et un type donnés. */
  async getDocument(locId: string, kind: DocumentKind) {
    return prisma.contractDocument.findUnique({
      where: { locationId_kind: { locationId: locId, kind } },
    });
  },

  /** Types de documents présents pour une location (métadonnées, sans les octets). */
  async listKinds(locId: string) {
    const docs = await prisma.contractDocument.findMany({
      where: { locationId: locId },
      select: { kind: true },
    });
    return docs.map((d) => d.kind);
  },

  /** Supprime tous les documents d'une location (pour permettre un ré-upload). */
  async deleteForLocation(locId: string) {
    await prisma.contractDocument.deleteMany({ where: { locationId: locId } });
  },

  async getOwnerSignature() {
    return prisma.ownerSignature.findUnique({ where: { id: 'owner' } });
  },

  async saveOwnerSignature(bytes: Uint8Array, mimeType = 'image/png') {
    const content = Buffer.from(bytes);
    await prisma.ownerSignature.upsert({
      where: { id: 'owner' },
      create: { id: 'owner', content, mimeType },
      update: { content, mimeType },
    });
  },
};
