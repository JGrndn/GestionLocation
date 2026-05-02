import { prisma } from '@/lib/prisma';
import { fromContactInput, toContactDTO } from '@/mappers/contact.mapper';
import type { ContactInput } from '@/lib/schema';

export const contactService = {
  async findAll() {
    const contacts = await prisma.contact.findMany({
      orderBy: { nom: 'asc' },
      include: { locations: { orderBy: { dateArrivee: 'desc' } } },
    });
    return contacts.map(toContactDTO);
  },

  async findAllLight() {
    const contacts = await prisma.contact.findMany({
      orderBy: { nom: 'asc' },
    });
    return contacts;
  },

  async findById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { locations: { orderBy: { dateArrivee: 'desc' } } },
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
      include: { locations: { orderBy: { dateArrivee: 'desc' } } },
    });
    return toContactDTO(contact);
  },

  async delete(id: string) {
    await prisma.contact.delete({ where: { id } });
  },
};