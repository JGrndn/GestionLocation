import { prisma } from '@/lib/prisma';
import { fromContactFormDTO, toContactDTO } from '@/mappers/contact.mapper';
import type { ContactFormDTO } from '@/dto/contact.dto';

export const contactService = {
  async findAll() {
    const contacts = await prisma.contact.findMany({
      orderBy: { nom: 'asc' },
      include: { locations: { orderBy: { dateArrivee: 'desc' } } },
    });
    return contacts.map(toContactDTO);
  },

  async findById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { locations: { orderBy: { dateArrivee: 'desc' } } },
    });
    return contact ? toContactDTO(contact) : null;
  },

  async create(body: ContactFormDTO) {
    const contact = await prisma.contact.create({
      data: fromContactFormDTO(body),
      include: { locations: true },
    });
    return toContactDTO(contact);
  },

  async update(id: string, body: ContactFormDTO) {
    const contact = await prisma.contact.update({
      where: { id },
      data: fromContactFormDTO(body),
      include: { locations: { orderBy: { dateArrivee: 'desc' } } },
    });
    return toContactDTO(contact);
  },

  async delete(id: string) {
    await prisma.contact.delete({ where: { id } });
  },
};