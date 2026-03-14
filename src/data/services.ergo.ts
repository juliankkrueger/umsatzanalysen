import type { ServiceDefinition } from './types';

export const ergoServices: ServiceDefinition[] = [
  { id: 'pf60', name: 'Psychisch Funktionell 60 Min.', gkvPrice: 71.67, defaultPkvMultiplier: 1.4 },
  { id: 'pfg90', name: 'Psychisch Funktionell Gruppe 90 Min.', gkvPrice: 46.59, defaultPkvMultiplier: 2.3 },
  { id: 'mf30', name: 'Motorisch Funktionell 30 Min.', gkvPrice: 35.84, defaultPkvMultiplier: 1.4 },
  { id: 'sp45', name: 'Sensomotorisch Perzeptiv 45 Min.', gkvPrice: 53.75, defaultPkvMultiplier: 1.4 },
  { id: 'spg45', name: 'Sensomotorisch Perzeptiv Gruppe 45 Min.', gkvPrice: 34.93, defaultPkvMultiplier: 2.3 },
  { id: 'fa', name: 'Funktionsanalyse', gkvPrice: 117.27, defaultPkvMultiplier: 1.4 },
  { id: 'hb', name: 'Hausbesuchspauschale', gkvPrice: 22.38, defaultPkvMultiplier: 1.4 },
  { id: 'hbheim', name: 'Hausbesuchspauschale Heim', gkvPrice: 12.77, defaultPkvMultiplier: 1.4 },
];
