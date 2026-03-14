import { useAnalyseStore } from '../../store/useAnalyseStore';
import { useCalculations } from '../../hooks/useCalculations';
import { fmtEuro, fmtNumber } from '../../utils/format';

export function TabAuswertung() {
  const { basisdaten, szenario, updateSzenario } = useAnalyseStore();
  const { results, szenarioResults } = useCalculations();

  const rows = [
    {
      label: 'Anzahl Mitarbeiter (VZÄ)',
      ist: fmtNumber(basisdaten.anzahlMitarbeiterVZAE, 1),
      szenario: fmtNumber(szenario.mitarbeiterSzenario, 1),
      delta: fmtNumber(szenario.mitarbeiterSzenario - basisdaten.anzahlMitarbeiterVZAE, 1),
      positive: szenario.mitarbeiterSzenario > basisdaten.anzahlMitarbeiterVZAE,
      hasValues: true,
    },
    {
      label: 'Behandlungen / Monat',
      ist: fmtNumber(results.behandlungenProMonat),
      szenario: '–',
      delta: '–',
      positive: true,
      hasValues: false,
    },
    {
      label: 'Effektive Behandlungen',
      ist: fmtNumber(results.effektiveBehandlungen),
      szenario: '–',
      delta: '–',
      positive: true,
      hasValues: false,
    },
    {
      label: 'Umsatz / MA / Monat',
      ist: fmtEuro(results.umsatzProMAProMonat),
      szenario: fmtEuro(szenario.zielumsatzProMA),
      delta: fmtEuro(szenario.zielumsatzProMA - results.umsatzProMAProMonat),
      positive: szenario.zielumsatzProMA > results.umsatzProMAProMonat,
      hasValues: true,
    },
    {
      label: 'Gesamtumsatz / Monat',
      ist: fmtEuro(results.gesamtumsatzMonat),
      szenario: fmtEuro(szenarioResults.gesamtumsatzMonat),
      delta: fmtEuro(szenarioResults.gesamtumsatzMonat - results.gesamtumsatzMonat),
      positive: szenarioResults.gesamtumsatzMonat > results.gesamtumsatzMonat,
      hasValues: true,
    },
    {
      label: 'Gesamtumsatz / Jahr',
      ist: fmtEuro(results.gesamtumsatzJahr),
      szenario: fmtEuro(szenarioResults.gesamtumsatzJahr),
      delta: fmtEuro(szenarioResults.gesamtumsatzJahr - results.gesamtumsatzJahr),
      positive: szenarioResults.gesamtumsatzJahr > results.gesamtumsatzJahr,
      hasValues: true,
    },
  ];

  const potenzial = szenarioResults.gesamtumsatzJahr - results.gesamtumsatzJahr;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-5xl mx-auto">

      {/* Szenario inputs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 tracking-tight">Szenario-Parameter</h2>
        <div className="flex flex-wrap gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600 whitespace-nowrap">Szenario Mitarbeiter</label>
            <input
              type="number"
              value={szenario.mitarbeiterSzenario}
              onChange={e => updateSzenario({ mitarbeiterSzenario: Number(e.target.value) })}
              className="w-24 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600 whitespace-nowrap">Zielumsatz / MA / Monat</label>
            <input
              type="number"
              value={szenario.zielumsatzProMA}
              onChange={e => updateSzenario({ zielumsatzProMA: Number(e.target.value) })}
              className="w-32 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
            />
            <span className="text-sm text-slate-400">€</span>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 sm:px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Kennzahl
                </th>
                <th className="px-4 sm:px-5 py-3 text-right text-[10px] font-semibold text-blue-500 uppercase tracking-wider bg-blue-50/40">
                  IST
                </th>
                <th className="px-4 sm:px-5 py-3 text-right text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50/40">
                  Szenario
                </th>
                <th className="px-4 sm:px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => (
                <tr key={row.label} className={`hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                  <td className="px-4 sm:px-5 py-3 text-slate-700 font-medium text-sm">{row.label}</td>
                  <td className="px-4 sm:px-5 py-3 text-right font-mono text-sm text-slate-500 bg-blue-50/10">{row.ist}</td>
                  <td className="px-4 sm:px-5 py-3 text-right font-mono font-semibold text-sm text-slate-700 bg-emerald-50/10">{row.szenario}</td>
                  <td className={`px-4 sm:px-5 py-3 text-right font-mono font-semibold text-sm ${
                    row.delta === '–' ? 'text-slate-300' : row.positive ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {row.hasValues && row.positive && row.delta !== '0,00 €' && '+'}
                    {row.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI highlight cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider mb-1.5">Jahresumsatz IST</div>
          <div className="text-xl sm:text-2xl font-bold font-mono">{fmtEuro(results.gesamtumsatzJahr)}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">Jahresumsatz Szenario</div>
          <div className="text-xl sm:text-2xl font-bold font-mono">{fmtEuro(szenarioResults.gesamtumsatzJahr)}</div>
        </div>
        <div className={`rounded-xl p-4 sm:p-5 shadow-sm col-span-2 md:col-span-1 ${potenzial >= 0 ? 'bg-slate-900' : 'bg-red-900'}`}>
          <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${potenzial >= 0 ? 'text-slate-400' : 'text-red-300'}`}>
            Zusätzl. Potenzial / Jahr
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono ${potenzial >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {potenzial >= 0 ? '+' : ''}{fmtEuro(potenzial)}
          </div>
        </div>
      </div>
    </div>
  );
}
