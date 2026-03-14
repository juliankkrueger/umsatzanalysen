import type { ServiceDefinition } from './types';

export const logoServices: ServiceDefinition[] = [
  { id: 'erstdiag', name: 'Erstdiagnostik', gkvPrice: 117.27, defaultPkvMultiplier: 1.8 },
  { id: 'bedarfsdiag', name: 'Bedarfsdiagnostik', gkvPrice: 58.64, defaultPkvMultiplier: 1.4 },
  { id: 'et30', name: 'Einzel-Therapie 30 Min.', gkvPrice: 52.12, defaultPkvMultiplier: 1.4 },
  { id: 'et45', name: 'Einzel-Therapie 45 Min.', gkvPrice: 71.67, defaultPkvMultiplier: 1.8 },
  { id: 'et60', name: 'Einzel-Therapie 60 Min.', gkvPrice: 91.21, defaultPkvMultiplier: 1.4 },
  { id: 'gt45_2', name: 'Gruppen-Therapie 45 Min. (2 Pat.)', gkvPrice: 46.59, defaultPkvMultiplier: 1.4 },
  { id: 'gt90_2', name: 'Gruppen-Therapie 90 Min. (2 Pat.)', gkvPrice: 65.20, defaultPkvMultiplier: 1.4 },
  { id: 'gt45_3', name: 'Gruppen-Therapie 45 Min. (3-5 Pat.)', gkvPrice: 32.58, defaultPkvMultiplier: 1.4 },
  { id: 'gt90_3', name: 'Gruppen-Therapie 90 Min. (3-5 Pat.)', gkvPrice: 46.59, defaultPkvMultiplier: 1.4 },
  { id: 'hb', name: 'Hausbesuch', gkvPrice: 22.38, defaultPkvMultiplier: 1.4 },
  { id: 'vbericht', name: 'Verordnungs-Bericht', gkvPrice: 6.52, defaultPkvMultiplier: 1.4 },
  { id: 'sbericht', name: 'Bericht auf besondere Anforderung', gkvPrice: 117.27, defaultPkvMultiplier: 1.8 },
];
