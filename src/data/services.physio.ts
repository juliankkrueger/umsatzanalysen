import type { ServiceDefinition } from './types';

export const physioServices: ServiceDefinition[] = [
  { id: 'mld30', name: 'MLD 30 Min.', gkvPrice: 35.10, defaultPkvMultiplier: 1.8 },
  { id: 'mld45', name: 'MLD 45 Min.', gkvPrice: 52.63, defaultPkvMultiplier: 1.4 },
  { id: 'mld60', name: 'MLD 60 Min.', gkvPrice: 70.19, defaultPkvMultiplier: 1.4 },
  { id: 'kg', name: 'KG', gkvPrice: 28.91, defaultPkvMultiplier: 1.4 },
  { id: 'kgg', name: 'KGG (bis 3 Pat.)', gkvPrice: 54.45, defaultPkvMultiplier: 1.4 },
  { id: 'mt', name: 'MT', gkvPrice: 34.72, defaultPkvMultiplier: 1.4 },
  { id: 'fango', name: 'Fango Teilpackung', gkvPrice: 36.20, defaultPkvMultiplier: 1.4 },
  { id: 'hb', name: 'Hausbesuch', gkvPrice: 22.23, defaultPkvMultiplier: 1.4 },
  { id: 'hbheim', name: 'Hausbesuch Heim', gkvPrice: 12.77, defaultPkvMultiplier: 1.4 },
  { id: 'kgzns', name: 'KG ZNS (Bobath/Vojta/PNF)', gkvPrice: 45.92, defaultPkvMultiplier: 1.4 },
];
