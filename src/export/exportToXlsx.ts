import * as XLSX from 'xlsx';
import type { BasisdatenInputs, MitarbeiterInputs, UmsatzverteilungInputs, SzenarioInputs, BepInputs, BasisdatenResults, BepDataPoint, Discipline } from '../data/types';
import { getServices, getDisciplineLabel } from '../data';

interface ExportData {
  discipline: Discipline;
  basisdaten: BasisdatenInputs;
  results: BasisdatenResults;
  mitarbeiter: MitarbeiterInputs;
  umsatzverteilung: UmsatzverteilungInputs;
  szenario: SzenarioInputs;
  bep: BepInputs;
  bepSeries: BepDataPoint[];
  szenarioResults: BasisdatenResults & { anzahlMitarbeiterVZAE: number };
}

const GREEN_FILL = { fgColor: { rgb: 'B6D7A8' } };
const GRAY_FILL = { fgColor: { rgb: 'E0E0E0' } };
const BLUE_FILL = { fgColor: { rgb: 'CFE2F3' } };
const HEADER_FILL = { fgColor: { rgb: '4A86E8' } };

function cell(v: string | number, fill?: typeof GREEN_FILL, bold = false): XLSX.CellObject {
  return {
    v,
    t: typeof v === 'number' ? 'n' : 's',
    s: {
      fill: fill ? { patternType: 'solid', ...fill } : undefined,
      font: bold ? { bold: true } : undefined,
      alignment: { wrapText: true },
    },
  };
}

function euroCell(v: number, fill?: typeof GREEN_FILL): XLSX.CellObject {
  return {
    v,
    t: 'n',
    z: '#,##0.00 "€"',
    s: {
      fill: fill ? { patternType: 'solid', ...fill } : undefined,
      numFmt: '#,##0.00 "€"',
    },
  };
}

function pctCell(v: number, fill?: typeof GREEN_FILL): XLSX.CellObject {
  return {
    v: v * 100,
    t: 'n',
    z: '0.00"%"',
    s: {
      fill: fill ? { patternType: 'solid', ...fill } : undefined,
    },
  };
}

export function exportToXlsx(data: ExportData, praxisName = 'Praxis') {
  const wb = XLSX.utils.book_new();
  const services = getServices(data.discipline);
  const disciplineLabel = getDisciplineLabel(data.discipline);

  // Sheet 1: Parameter
  const paramData = [
    [cell('PARAMETER – ' + disciplineLabel, HEADER_FILL, true)],
    [cell('Parameter'), cell('Wert', undefined, true)],
    [cell('Disziplin'), cell(disciplineLabel)],
    [cell('Anzahl Mitarbeiter (VZÄ)'), { v: data.basisdaten.anzahlMitarbeiterVZAE, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject],
    [cell('Behandlungen/Tag/Mitarbeiter'), { v: data.basisdaten.behandlungenProTagProMA, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject],
    [cell('Arbeitstage/Monat'), { v: data.basisdaten.arbeitstageProMonat, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject],
    [cell('Satz GKV Durchschnitt'), euroCell(data.basisdaten.satzGkvDurchschnitt, GREEN_FILL)],
    [cell('Satz PKV Durchschnitt'), euroCell(data.basisdaten.satzPkvDurchschnitt, GREEN_FILL)],
    [cell('Anteil PKV'), pctCell(data.basisdaten.anteilPkv, GREEN_FILL)],
    [cell('Ausfallquote'), pctCell(data.basisdaten.ausfallquote, GREEN_FILL)],
    [],
    [cell('ERGEBNISSE', BLUE_FILL, true)],
    [cell('Behandlungen pro Monat'), { v: Math.round(data.results.behandlungenProMonat), t: 'n', s: { fill: { patternType: 'solid', ...GRAY_FILL } } } as XLSX.CellObject],
    [cell('Effektive Behandlungen'), { v: Math.round(data.results.effektiveBehandlungen), t: 'n', s: { fill: { patternType: 'solid', ...GRAY_FILL } } } as XLSX.CellObject],
    [cell('Umsatz/Behandlung (gewichtet)'), euroCell(data.results.umsatzProBehandlungGewichtet, GRAY_FILL)],
    [cell('Umsatz/MA/Monat'), euroCell(data.results.umsatzProMAProMonat, GRAY_FILL)],
    [cell('Gesamtumsatz Monat'), euroCell(data.results.gesamtumsatzMonat, GRAY_FILL)],
    [cell('Gesamtumsatz Jahr'), euroCell(data.results.gesamtumsatzJahr, GRAY_FILL)],
  ];

  const paramWs = XLSX.utils.aoa_to_sheet(paramData);
  paramWs['!cols'] = [{ wch: 35 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, paramWs, 'Parameter');

  // Sheet 2: Mitarbeiter
  const maHeaders = ['ID', 'Name', 'Wochenstunden', 'Umsatz/Monat', 'Gehalt', 'Gehaltsanteil %', 'Umsatz/Stunde'];
  const maData = [
    [cell('MITARBEITER', HEADER_FILL, true)],
    maHeaders.map(h => cell(h, undefined, true)),
    ...data.mitarbeiter.employees.map(e => {
      const gehaltsanteil = e.umsatzProMonat && e.gehalt ? e.gehalt / e.umsatzProMonat : null;
      const umsatzStunde = e.umsatzProMonat && e.wochenstunden ? e.umsatzProMonat / (e.wochenstunden * 4.33) : null;
      return [
        cell(e.id),
        cell(e.name || ''),
        { v: e.wochenstunden, t: 'n' } as XLSX.CellObject,
        e.umsatzProMonat ? euroCell(e.umsatzProMonat, GREEN_FILL) : cell(''),
        e.gehalt ? euroCell(e.gehalt, GREEN_FILL) : cell(''),
        gehaltsanteil ? pctCell(gehaltsanteil) : cell(''),
        umsatzStunde ? euroCell(umsatzStunde) : cell(''),
      ];
    }),
  ];
  const maWs = XLSX.utils.aoa_to_sheet(maData);
  maWs['!cols'] = [{ wch: 6 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 16 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, maWs, 'Mitarbeiter');

  // Sheet 3: Leistungsmix
  const employeeIds = data.mitarbeiter.employees.map(e => e.id);
  const lmHeaders = ['Leistung', 'GKV-Preis', 'PKV (1,4x)', 'PKV Multiplikator', 'PKV-Preis', ...employeeIds, 'Gesamt Monat'];
  const lmData = [
    [cell('LEISTUNGSMIX', HEADER_FILL, true)],
    lmHeaders.map(h => cell(h, undefined, true)),
    ...services.map(svc => {
      const override = data.umsatzverteilung.pkvOverrides.find(o => o.serviceId === svc.id);
      const multiplier = override ? override.multiplier : svc.defaultPkvMultiplier;
      const pkvPrice = svc.gkvPrice * multiplier;
      const countEntry = data.umsatzverteilung.serviceCounts.find(c => c.serviceId === svc.id);
      const counts = employeeIds.map(id => countEntry?.countsPerEmployee[id] || 0);
      const totalCount = counts.reduce((a, b) => a + b, 0);
      return [
        cell(svc.name),
        euroCell(svc.gkvPrice),
        euroCell(svc.gkvPrice * 1.4),
        { v: multiplier, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject,
        euroCell(pkvPrice),
        ...counts.map(c => ({ v: c, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject)),
        { v: totalCount, t: 'n', s: { fill: { patternType: 'solid', ...GRAY_FILL } } } as XLSX.CellObject,
      ];
    }),
  ];
  const lmWs = XLSX.utils.aoa_to_sheet(lmData);
  lmWs['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 12 }, ...employeeIds.map(() => ({ wch: 8 })), { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, lmWs, 'Leistungsmix');

  // Sheet 4: Auswertung
  const auswData = [
    [cell('AUSWERTUNG', HEADER_FILL, true)],
    [cell('Kennzahl', undefined, true), cell('Ist', undefined, true), cell('Szenario', undefined, true), cell('Delta', undefined, true)],
    [cell('Anzahl Mitarbeiter (VZÄ)'), { v: data.basisdaten.anzahlMitarbeiterVZAE, t: 'n' } as XLSX.CellObject, { v: data.szenario.mitarbeiterSzenario, t: 'n' } as XLSX.CellObject, { v: data.szenario.mitarbeiterSzenario - data.basisdaten.anzahlMitarbeiterVZAE, t: 'n' } as XLSX.CellObject],
    [cell('Behandlungen pro Monat'), { v: Math.round(data.results.behandlungenProMonat), t: 'n' } as XLSX.CellObject, cell('–'), cell('–')],
    [cell('Effektive Behandlungen'), { v: Math.round(data.results.effektiveBehandlungen), t: 'n' } as XLSX.CellObject, cell('–'), cell('–')],
    [cell('Umsatz/MA/Monat'), euroCell(data.results.umsatzProMAProMonat), euroCell(data.szenario.zielumsatzProMA), euroCell(data.szenario.zielumsatzProMA - data.results.umsatzProMAProMonat)],
    [cell('Gesamtumsatz Monat'), euroCell(data.results.gesamtumsatzMonat), euroCell(data.szenarioResults.gesamtumsatzMonat), euroCell(data.szenarioResults.gesamtumsatzMonat - data.results.gesamtumsatzMonat)],
    [cell('Gesamtumsatz Jahr'), euroCell(data.results.gesamtumsatzJahr), euroCell(data.szenarioResults.gesamtumsatzJahr), euroCell(data.szenarioResults.gesamtumsatzJahr - data.results.gesamtumsatzJahr)],
  ];
  const auswWs = XLSX.utils.aoa_to_sheet(auswData);
  auswWs['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, auswWs, 'Auswertung');

  // Sheet 5: BEP
  const bepData = [
    [cell('BREAK-EVEN-ANALYSE', HEADER_FILL, true)],
    [cell('Investition'), euroCell(data.bep.investition, GREEN_FILL)],
    [cell('Szenario Mitarbeiter'), { v: data.szenario.mitarbeiterSzenario, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject],
    [cell('Zielumsatz/MA/Monat'), euroCell(data.szenario.zielumsatzProMA, GREEN_FILL)],
    [cell('Zeitraum (Monate)'), { v: data.bep.zeitraumMonate, t: 'n', s: { fill: { patternType: 'solid', ...GREEN_FILL } } } as XLSX.CellObject],
    [],
    [cell('Monat', undefined, true), cell('Kumulierter Gewinn', undefined, true), cell('BEP-Marker', undefined, true)],
    ...data.bepSeries.map(p => [
      { v: p.monat, t: 'n' } as XLSX.CellObject,
      euroCell(p.kumulierterGewinn),
      p.bepMarker !== null ? euroCell(p.bepMarker) : cell(''),
    ]),
  ];
  const bepWs = XLSX.utils.aoa_to_sheet(bepData);
  bepWs['!cols'] = [{ wch: 10 }, { wch: 22 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, bepWs, 'BEP');

  // Download
  const filename = `Umsatzpotenzialanalyse_${praxisName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('de-DE').replace(/\./g, '-')}.xlsx`;
  XLSX.writeFile(wb, filename);
}
