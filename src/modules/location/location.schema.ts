import { z } from 'zod';

export const LocationSchema = z.object({
  dateArrivee: z.string().date('Date d\'arrivée invalide'),
  depart: z.string().date('Date de départ invalide'),
  adultes: z.coerce.number().int().min(1).max(20),
  enfants: z.coerce.number().int().min(0).max(20),
  animaux: z.coerce.number().int().min(0).max(10),
  prixBase: z.coerce.number().min(0).max(100000),
  taxeParNuit: z.coerce.number().min(0).max(1000),
  frais: z.coerce.number().min(0).max(10000),
  acompte: z.coerce.number().min(0).max(100000),
  caution: z.coerce.number().min(0).max(100000),
  langue: z.enum(['fr', 'en']),
}).refine(d => new Date(d.depart) > new Date(d.dateArrivee), {
  message: 'La date de départ doit être après la date d\'arrivée',
  path: ['depart'],
});

export type LocationInput = z.infer<typeof LocationSchema>;
