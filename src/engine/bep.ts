import type { BepDataPoint, BepInputs, BasisdatenResults, SzenarioInputs } from '../data/types';

export function calcBepSeries(
  bepInputs: BepInputs,
  szenario: SzenarioInputs,
  current: BasisdatenResults
): BepDataPoint[] {
  const monthlyIncrement =
    szenario.mitarbeiterSzenario * szenario.zielumsatzProMA
    - current.gesamtumsatzMonat;

  if (monthlyIncrement <= 0) {
    return Array.from({ length: bepInputs.zeitraumMonate }, (_, i) => ({
      monat: i + 1,
      kumulierterGewinn: -bepInputs.investition,
      bepMarker: null,
    }));
  }

  let cumulative = -bepInputs.investition;
  let bepFound = false;
  const series: BepDataPoint[] = [];

  for (let i = 0; i < bepInputs.zeitraumMonate; i++) {
    cumulative += monthlyIncrement;
    const isBep = !bepFound && cumulative >= 0;
    if (isBep) bepFound = true;
    series.push({
      monat: i + 1,
      kumulierterGewinn: cumulative,
      bepMarker: isBep ? cumulative : null,
    });
  }

  return series;
}

export function getBepMonth(series: BepDataPoint[]): number | null {
  const bep = series.find(p => p.bepMarker !== null);
  return bep ? bep.monat : null;
}
