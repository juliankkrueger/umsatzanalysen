import type { ServiceDefinition, ServiceCountEntry, ServicePkvOverride } from '../data/types';

export function getPkvMultiplier(serviceId: string, overrides: ServicePkvOverride[], defaultMultiplier: number): number {
  const override = overrides.find(o => o.serviceId === serviceId);
  return override ? override.multiplier : defaultMultiplier;
}

export function calcWeightedRates(
  services: ServiceDefinition[],
  overrides: ServicePkvOverride[],
  counts: ServiceCountEntry[]
): { avgGkv: number; avgPkv: number } | null {
  let totalCount = 0;
  let totalGkv = 0;
  let totalPkv = 0;

  for (const service of services) {
    const countEntry = counts.find(c => c.serviceId === service.id);
    if (!countEntry) continue;
    const count = Object.values(countEntry.countsPerEmployee).reduce((a, b) => a + b, 0);
    if (count === 0) continue;
    const multiplier = getPkvMultiplier(service.id, overrides, service.defaultPkvMultiplier);
    totalCount += count;
    totalGkv += count * service.gkvPrice;
    totalPkv += count * service.gkvPrice * multiplier;
  }

  if (totalCount === 0) return null;
  return { avgGkv: totalGkv / totalCount, avgPkv: totalPkv / totalCount };
}
