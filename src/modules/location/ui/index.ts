export { LocationModal } from './LocationModal';
export { useLocations } from '../location.hook';
// Ré-exports client-safe (pure / types) : évite d'importer le barrel serveur
// (`@/modules/location`, qui tire `locationService` → prisma → pg) côté client.
export { calcLocation } from '../location.calc';
export type { LocationDTO } from '../location.dto';
export type { LocationInput } from '../location.schema';
