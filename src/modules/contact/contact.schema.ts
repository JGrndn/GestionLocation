import { z } from 'zod';

export const ContactSchema = z.object({
  prenom: z.string().min(1, 'Prénom requis').max(100),
  nom: z.string().min(1, 'Nom requis').max(100),
  email: z.string().email('Email invalide').max(200).or(z.literal('')).optional(),
  telephone: z.string().max(30).optional(),
  adresse: z.string().max(300).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;