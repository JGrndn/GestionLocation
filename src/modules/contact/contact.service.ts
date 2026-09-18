import { prisma } from '@/lib/prisma';
import { fromContactInput, toContactDTO } from './contact.mapper';
import type { ContactInput } from './contact.schema';
import type { ContactSummary } from './contact.dto';

// Charge les locations d'un contact avec, pour chacune, le type des documents
// présents (sans les octets) afin d'exposer l'état signé/contre-signé à l'UI.
const locationsWithDocs = {
  orderBy: { dateArrivee: 'desc' as const },
  include: { documents: { select: { kind: true } } },
};

export const contactService = {
  async findAll() {
    const contacts = await prisma.contact.findMany({
      orderBy: { nom: 'asc' },
      include: { locations: locationsWithDocs },
    });
    return contacts.map(toContactDTO);
  },

  async findAllLight(): Promise<ContactSummary[]> {
    return prisma.contact.findMany({
      orderBy: { nom: 'asc' },
      select: { id: true, prenom: true, nom: true, email: true, telephone: true },
    });
  },

  async findById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { locations: locationsWithDocs },
    });
    return contact ? toContactDTO(contact) : null;
  },

  async create(body: ContactInput) {
    const contact = await prisma.contact.create({
      data: fromContactInput(body),
      include: { locations: true },
    });
    return toContactDTO(contact);
  },

  async update(id: string, body: ContactInput) {
    const contact = await prisma.contact.update({
      where: { id },
      data: fromContactInput(body),
      include: { locations: locationsWithDocs },
    });
    return toContactDTO(contact);
  },

  async delete(id: string) {
    await prisma.contact.delete({ where: { id } });
  },
};