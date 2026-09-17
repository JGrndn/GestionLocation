export { ContactList } from './ContactList';
export { ContactDetail } from './ContactDetail';
export { ContactModal } from './ContactModal';
export { useContacts } from '../contact.hook';
// Ré-exports client-safe (types) : évite d'importer le barrel serveur
// (`@/modules/contact`, qui tire `contactService` → prisma → pg) côté client.
export type { ContactDTO } from '../contact.dto';
export type { ContactInput } from '../contact.schema';
