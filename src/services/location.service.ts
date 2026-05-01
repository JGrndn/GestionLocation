import { prisma } from '@/lib/prisma';
import { fromLocationFormDTO, toLocationDTO } from '@/mappers/location.mapper';
import type { LocationFormDTO } from '@/dto/location.dto';

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

  async create(contactId: string, body: LocationFormDTO) {
    const location = await prisma.location.create({
      data: { contactId, ...fromLocationFormDTO(body) },
    });
    return toLocationDTO(location);
  },

  async update(locId: string, body: LocationFormDTO) {
    const location = await prisma.location.update({
      where: { id: locId },
      data: fromLocationFormDTO(body),
    });
    return toLocationDTO(location);
  },

  async delete(locId: string) {
    await prisma.location.delete({ where: { id: locId } });
  },
};