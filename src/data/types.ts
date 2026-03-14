export type Discipline = 'physio' | 'ergo' | 'logo';

export interface ServiceDefinition {
  id: string;
  name: string;
  gkvPrice: number;
  defaultPkvMultiplier: number;
}

export interface EmployeeRow {
  id: string;
  name: string;
  wochenstunden: number;
  umsatzProMonat: number | null;
  gehalt: number | null;
}

export interface BasisdatenInputs {
  anzahlMitarbeiterVZAE: number;
  behandlungenProTagProMA: number;
  arbeitstageProMonat: number;
  satzGkvDurchschnitt: number;
  satzPkvDurchschnitt: number;
  anteilPkv: number;
  ausfallquote: number;
  useCalculatedRates: boolean;
}

export interface MitarbeiterInputs {
  employees: EmployeeRow[];
  neueinstellungen: number;
  fluktuationsrate: number;
}

export interface ServicePkvOverride {
  serviceId: string;
  multiplier: number;
}

export interface ServiceCountEntry {
  serviceId: string;
  countsPerEmployee: Record<string, number>;
}

export interface UmsatzverteilungInputs {
  pkvOverrides: ServicePkvOverride[];
  serviceCounts: ServiceCountEntry[];
}

export interface SzenarioInputs {
  mitarbeiterSzenario: number;
  zielumsatzProMA: number;
}

export interface BepInputs {
  investition: number;
  zeitraumMonate: number;
}

export interface BasisdatenResults {
  behandlungenProMonat: number;
  effektiveBehandlungen: number;
  umsatzProBehandlungGewichtet: number;
  umsatzProMAProMonat: number;
  gesamtumsatzMonat: number;
  gesamtumsatzJahr: number;
}

export interface BepDataPoint {
  monat: number;
  kumulierterGewinn: number;
  bepMarker: number | null;
}

export interface MitarbeiterSummary {
  gesamtWochenstunden: number;
  avgUmsatzProMonat: number;
  avgGehalt: number;
  avgGehaltsanteil: number;
  avgUmsatzProStunde: number;
  jahresumsatz: number;
}
