import { useAnalyseStore } from '../../store/useAnalyseStore';
import { useCalculations } from '../../hooks/useCalculations';
import { NumInput } from '../shared/NumInput';
import { KpiCard } from '../shared/KpiCard';
import { fmtEuro, fmtNumber, fmtPercent } from '../../utils/format';

export function TabParameter() {
  const { basisdaten, updateBasisdaten } = useAnalyseStore();
  const { results, weightedRates } = useCalculations();

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
      {/* Left: Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Grundparameter</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Praxis-Kennzahlen eingeben</p>
        </div>
        <div className="p-5 space-y-3.5">
          <Row label="Anzahl Mitarbeiter (VZÄ)" hint="Vollzeitäquivalent, z.B. 2,5">
            <NumInput
              value={basisdaten.anzahlMitarbeiterVZAE}
              onChange={v => updateBasisdaten({ anzahlMitarbeiterVZAE: v })}
              min={0} step={0.1}
            />
          </Row>
          <Row label="Behandlungen / Tag / Mitarbeiter">
            <NumInput
              value={basisdaten.behandlungenProTagProMA}
              onChange={v => updateBasisdaten({ behandlungenProTagProMA: v })}
              min={0}
            />
          </Row>
          <Row label="Arbeitstage / Monat">
            <NumInput
              value={basisdaten.arbeitstageProMonat}
              onChange={v => updateBasisdaten({ arbeitstageProMonat: v })}
              min={0} max={31}
            />
          </Row>
          <Row label="PKV-Anteil" hint="Anteil der Privatpatienten">
            <NumInput
              value={basisdaten.anteilPkv * 100}
              onChange={v => updateBasisdaten({ anteilPkv: v / 100 })}
              min={0} max={100} suffix="%"
            />
          </Row>
          <Row label="Ausfallquote" hint="Stornierungen, No-Shows">
            <NumInput
              value={basisdaten.ausfallquote * 100}
              onChange={v => updateBasisdaten({ ausfallquote: v / 100 })}
              min={0} max={100} suffix="%"
            />
          </Row>

          <div className="border-t border-slate-100 pt-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">GKV / PKV-Sätze</span>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={basisdaten.useCalculatedRates}
                  onChange={e => updateBasisdaten({ useCalculatedRates: e.target.checked })}
                  className="w-3.5 h-3.5"
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                  Aus Leistungsmix
                </span>
                {weightedRates && (
                  <span className="text-xs text-emerald-600 font-mono">
                    ∅ {fmtEuro(weightedRates.avgGkv)}
                  </span>
                )}
              </label>
            </div>
            <div className="space-y-3">
              <Row label="Satz GKV Ø">
                <NumInput
                  value={basisdaten.satzGkvDurchschnitt}
                  onChange={v => updateBasisdaten({ satzGkvDurchschnitt: v })}
                  step={0.01} suffix="€"
                  disabled={basisdaten.useCalculatedRates}
                />
              </Row>
              <Row label="Satz PKV Ø">
                <NumInput
                  value={basisdaten.satzPkvDurchschnitt}
                  onChange={v => updateBasisdaten({ satzPkvDurchschnitt: v })}
                  step={0.01} suffix="€"
                  disabled={basisdaten.useCalculatedRates}
                />
              </Row>
            </div>
          </div>
        </div>
      </div>

      {/* Right: KPIs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Ergebnisse</h2>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Live
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            label="Behandlungen / Monat"
            value={fmtNumber(results.behandlungenProMonat)}
          />
          <KpiCard
            label="Effektive Behandlungen"
            value={fmtNumber(results.effektiveBehandlungen)}
            sub={`−${fmtPercent(basisdaten.ausfallquote)} Ausfall`}
          />
          <KpiCard
            label="Umsatz / Behandlung"
            value={fmtEuro(results.umsatzProBehandlungGewichtet)}
          />
          <KpiCard
            label="Umsatz / MA / Monat"
            value={fmtEuro(results.umsatzProMAProMonat)}
          />
          <KpiCard
            label="Monatsumsatz"
            value={fmtEuro(results.gesamtumsatzMonat)}
            highlight
          />
          <KpiCard
            label="Jahresumsatz"
            value={fmtEuro(results.gesamtumsatzJahr)}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-600 truncate">{label}</div>
        {hint && <div className="text-[11px] text-slate-400 truncate">{hint}</div>}
      </div>
      <div className="w-36 flex-shrink-0">{children}</div>
    </div>
  );
}
