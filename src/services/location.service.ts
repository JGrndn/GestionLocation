import { prisma } from '@/lib/prisma';
import { fromLocationInput, toLocationDTO } from '@/mappers/location.mapper';
import type { LocationInput } from '@/lib/schema';

export const locationService = {
  async findAllForContact(contactId: string) {
    const locations = await prisma.location.findMany({
      where: { contactId },
      orderBy: { dateArrivee: 'desc' },
    });
    return locations.map(toLocationDTO);
  },

  async findForPdf(locId: string) {
    return prisma.location.findUnique({
      where: { id: locId },
      include: { contact: true },
    });
  },

  async create(contactId: string, body: LocationInput) {
    const location = await prisma.location.create({
      data: { contactId, ...fromLocationInput(body) },
    });
    return toLocationDTO(location);
  },

  async update(locId: string, body: LocationInput) {
    const location = await prisma.location.update({
      where: { id: locId },
      data: fromLocationInput(body),
    });
    return toLocationDTO(location);
  },

  async delete(locId: string) {
    await prisma.location.delete({ where: { id: locId } });
  },
};