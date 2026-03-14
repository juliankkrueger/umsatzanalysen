import { create } from 'zustand';
import type { Discipline, BasisdatenInputs, MitarbeiterInputs, UmsatzverteilungInputs, SzenarioInputs, BepInputs, EmployeeRow, ServiceCountEntry, ServicePkvOverride } from '../data/types';
import { getServices } from '../data';

function defaultBasisdaten(discipline: Discipline): BasisdatenInputs {
  const services = getServices(discipline);
  const avgGkv = services.reduce((s, sv) => s + sv.gkvPrice, 0) / services.length;
  const avgPkv = services.reduce((s, sv) => s + sv.gkvPrice * sv.defaultPkvMultiplier, 0) / services.length;
  return {
    anzahlMitarbeiterVZAE: 3,
    behandlungenProTagProMA: 10,
    arbeitstageProMonat: 20,
    satzGkvDurchschnitt: Math.round(avgGkv * 100) / 100,
    satzPkvDurchschnitt: Math.round(avgPkv * 100) / 100,
    anteilPkv: 0.20,
    ausfallquote: 0.05,
    useCalculatedRates: false,
  };
}

function defaultMitarbeiter(): MitarbeiterInputs {
  const employees: EmployeeRow[] = Array.from({ length: 3 }, (_, i) => ({
    id: `M${i + 1}`,
    name: '',
    wochenstunden: 38,
    umsatzProMonat: null,
    gehalt: null,
  }));
  return { employees, neueinstellungen: 0, fluktuationsrate: 0.10 };
}

function defaultUmsatzverteilung(discipline: Discipline): UmsatzverteilungInputs {
  const services = getServices(discipline);
  const pkvOverrides: ServicePkvOverride[] = services.map(s => ({
    serviceId: s.id,
    multiplier: s.defaultPkvMultiplier,
  }));
  const serviceCounts: ServiceCountEntry[] = services.map(s => ({
    serviceId: s.id,
    countsPerEmployee: { M1: 0, M2: 0, M3: 0 },
  }));
  return { pkvOverrides, serviceCounts };
}

interface AnalyseStore {
  discipline: Discipline;
  basisdaten: BasisdatenInputs;
  mitarbeiter: MitarbeiterInputs;
  umsatzverteilung: UmsatzverteilungInputs;
  szenario: SzenarioInputs;
  bep: BepInputs;

  setDiscipline: (d: Discipline) => void;
  updateBasisdaten: (patch: Partial<BasisdatenInputs>) => void;
  updateEmployee: (id: string, patch: Partial<EmployeeRow>) => void;
  addEmployee: () => void;
  removeEmployee: (id: string) => void;
  updateMitarbeiter: (patch: Partial<Omit<MitarbeiterInputs, 'employees'>>) => void;
  updatePkvOverride: (serviceId: string, multiplier: number) => void;
  updateServiceCount: (serviceId: string, employeeId: string, count: number) => void;
  updateSzenario: (patch: Partial<SzenarioInputs>) => void;
  updateBep: (patch: Partial<BepInputs>) => void;
}

export const useAnalyseStore = create<AnalyseStore>((set) => ({
  discipline: 'physio',
  basisdaten: defaultBasisdaten('physio'),
  mitarbeiter: defaultMitarbeiter(),
  umsatzverteilung: defaultUmsatzverteilung('physio'),
  szenario: { mitarbeiterSzenario: 4, zielumsatzProMA: 12000 },
  bep: { investition: 42000, zeitraumMonate: 24 },

  setDiscipline: (d) => set({
    discipline: d,
    basisdaten: defaultBasisdaten(d),
    umsatzverteilung: defaultUmsatzverteilung(d),
  }),

  updateBasisdaten: (patch) => set(s => ({ basisdaten: { ...s.basisdaten, ...patch } })),

  updateEmployee: (id, patch) => set(s => ({
    mitarbeiter: {
      ...s.mitarbeiter,
      employees: s.mitarbeiter.employees.map(e => e.id === id ? { ...e, ...patch } : e),
    },
  })),

  addEmployee: () => set(s => {
    const count = s.mitarbeiter.employees.length + 1;
    const newId = `M${count}`;
    const newEmployee: EmployeeRow = { id: newId, name: '', wochenstunden: 38, umsatzProMonat: null, gehalt: null };
    const newCounts: ServiceCountEntry[] = s.umsatzverteilung.serviceCounts.map(sc => ({
      ...sc,
      countsPerEmployee: { ...sc.countsPerEmployee, [newId]: 0 },
    }));
    return {
      mitarbeiter: { ...s.mitarbeiter, employees: [...s.mitarbeiter.employees, newEmployee] },
      umsatzverteilung: { ...s.umsatzverteilung, serviceCounts: newCounts },
    };
  }),

  removeEmployee: (id) => set(s => ({
    mitarbeiter: { ...s.mitarbeiter, employees: s.mitarbeiter.employees.filter(e => e.id !== id) },
  })),

  updateMitarbeiter: (patch) => set(s => ({ mitarbeiter: { ...s.mitarbeiter, ...patch } })),

  updatePkvOverride: (serviceId, multiplier) => set(s => ({
    umsatzverteilung: {
      ...s.umsatzverteilung,
      pkvOverrides: s.umsatzverteilung.pkvOverrides.map(o =>
        o.serviceId === serviceId ? { ...o, multiplier } : o
      ),
    },
  })),

  updateServiceCount: (serviceId, employeeId, count) => set(s => ({
    umsatzverteilung: {
      ...s.umsatzverteilung,
      serviceCounts: s.umsatzverteilung.serviceCounts.map(sc =>
        sc.serviceId === serviceId
          ? { ...sc, countsPerEmployee: { ...sc.countsPerEmployee, [employeeId]: count } }
          : sc
      ),
    },
  })),

  updateSzenario: (patch) => set(s => ({ szenario: { ...s.szenario, ...patch } })),
  updateBep: (patch) => set(s => ({ bep: { ...s.bep, ...patch } })),
}));
