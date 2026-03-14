import { useMemo } from 'react';
import { useAnalyseStore } from '../store/useAnalyseStore';
import { calcBasisdaten } from '../engine/basisdaten';
import { calcWeightedRates } from '../engine/umsatzverteilung';
import { calcBepSeries, getBepMonth } from '../engine/bep';
import { calcMitarbeiterSummary } from '../engine/mitarbeiter';
import { getServices } from '../data';

export function useCalculations() {
  const { discipline, basisdaten, mitarbeiter, umsatzverteilung, szenario, bep } = useAnalyseStore();
  const services = getServices(discipline);

  const effectiveBasisdaten = useMemo(() => {
    if (basisdaten.useCalculatedRates) {
      const rates = calcWeightedRates(services, umsatzverteilung.pkvOverrides, umsatzverteilung.serviceCounts);
      if (rates) {
        return { ...basisdaten, satzGkvDurchschnitt: rates.avgGkv, satzPkvDurchschnitt: rates.avgPkv };
      }
    }
    return basisdaten;
  }, [basisdaten, services, umsatzverteilung]);

  const results = useMemo(() => calcBasisdaten(effectiveBasisdaten), [effectiveBasisdaten]);

  const szenarioResults = useMemo(() => {
    const szenarioMonatsumsatz = szenario.mitarbeiterSzenario * szenario.zielumsatzProMA;
    return {
      ...results,
      anzahlMitarbeiterVZAE: szenario.mitarbeiterSzenario,
      umsatzProMAProMonat: szenario.zielumsatzProMA,
      gesamtumsatzMonat: szenarioMonatsumsatz,
      gesamtumsatzJahr: szenarioMonatsumsatz * 12,
    };
  }, [effectiveBasisdaten, szenario, results]);

  const bepSeries = useMemo(() => calcBepSeries(bep, szenario, results), [bep, szenario, results]);
  const bepMonth = useMemo(() => getBepMonth(bepSeries), [bepSeries]);

  const weightedRates = useMemo(() =>
    calcWeightedRates(services, umsatzverteilung.pkvOverrides, umsatzverteilung.serviceCounts),
    [services, umsatzverteilung]
  );

  const mitarbeiterSummary = useMemo(() =>
    calcMitarbeiterSummary(mitarbeiter.employees),
    [mitarbeiter.employees]
  );

  return { results, szenarioResults, bepSeries, bepMonth, weightedRates, mitarbeiterSummary, effectiveBasisdaten };
}
