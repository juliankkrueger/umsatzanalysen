import type { EmployeeRow, MitarbeiterSummary } from '../data/types';

export function calcMitarbeiterSummary(employees: EmployeeRow[]): MitarbeiterSummary {
  const valid = employees.filter(e => e.umsatzProMonat && e.umsatzProMonat > 0);
  const count = valid.length || 1;

  const totalWochenstunden = employees.reduce((sum, e) => sum + (e.wochenstunden || 0), 0);
  const totalUmsatz = valid.reduce((sum, e) => sum + (e.umsatzProMonat || 0), 0);
  const totalGehalt = valid.filter(e => e.gehalt).reduce((sum, e) => sum + (e.gehalt || 0), 0);

  const avgUmsatz = totalUmsatz / count;
  const avgGehalt = valid.filter(e => e.gehalt).length > 0
    ? totalGehalt / valid.filter(e => e.gehalt).length
    : 0;

  const avgGehaltsanteil = avgUmsatz > 0 && avgGehalt > 0 ? avgGehalt / avgUmsatz : 0;

  const avgUmsatzProStunde = employees.reduce((sum, e) => {
    if (!e.umsatzProMonat || !e.wochenstunden) return sum;
    return sum + e.umsatzProMonat / (e.wochenstunden * 4.33);
  }, 0) / count;

  return {
    gesamtWochenstunden: totalWochenstunden,
    avgUmsatzProMonat: avgUmsatz,
    avgGehalt,
    avgGehaltsanteil,
    avgUmsatzProStunde,
    jahresumsatz: totalUmsatz * 12,
  };
}
