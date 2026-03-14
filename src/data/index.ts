export { physioServices } from './services.physio';
export { ergoServices } from './services.ergo';
export { logoServices } from './services.logo';
export type { Discipline, ServiceDefinition, BasisdatenInputs, BasisdatenResults, EmployeeRow, MitarbeiterInputs, ServicePkvOverride, ServiceCountEntry, UmsatzverteilungInputs, SzenarioInputs, BepInputs, BepDataPoint, MitarbeiterSummary } from './types';

import { physioServices } from './services.physio';
import { ergoServices } from './services.ergo';
import { logoServices } from './services.logo';
import type { Discipline, ServiceDefinition } from './types';

export function getServices(discipline: Discipline): ServiceDefinition[] {
  if (discipline === 'physio') return physioServices;
  if (discipline === 'ergo') return ergoServices;
  return logoServices;
}

export function getDisciplineLabel(discipline: Discipline): string {
  if (discipline === 'physio') return 'Physiotherapie';
  if (discipline === 'ergo') return 'Ergotherapie';
  return 'Logopädie';
}
