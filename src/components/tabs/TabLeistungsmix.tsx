import { useAnalyseStore } from '../../store/useAnalyseStore';
import { useCalculations } from '../../hooks/useCalculations';
import { getServices } from '../../data';
import { fmtEuro } from '../../utils/format';

export function TabLeistungsmix() {
  const { discipline, mitarbeiter, umsatzverteilung, updatePkvOverride, updateServiceCount } = useAnalyseStore();
  const { weightedRates } = useCalculations();
  const services = getServices(discipline);
  const employees = mitarbeiter.employees;

  const getMultiplier = (serviceId: string, defaultM: number) => {
    return umsatzverteilung.pkvOverrides.find(o => o.serviceId === serviceId)?.multiplier ?? defaultM;
  };

  const getCount = (serviceId: string, empId: string) => {
    return umsatzverteilung.serviceCounts.find(c => c.serviceId === serviceId)?.countsPerEmployee[empId] ?? 0;
  };

  const getTotalCount = (serviceId: string) => {
    return employees.reduce((sum, e) => sum + getCount(serviceId, e.id), 0);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-6xl mx-auto">

      {/* Price table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Preistabelle</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">PKV-Multiplikator pro Leistung anpassbar</p>
          </div>
          {weightedRates && (
            <div className="text-right">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gewichteter Ø</div>
              <div className="text-xs font-mono font-semibold text-emerald-600 mt-0.5">
                GKV {fmtEuro(weightedRates.avgGkv)} · PKV {fmtEuro(weightedRates.avgPkv)}
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Leistung</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">GKV</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">PKV (1,4×)</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50/40">Multiplikator</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">PKV-Preis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((svc, idx) => {
                const mult = getMultiplier(svc.id, svc.defaultPkvMultiplier);
                return (
                  <tr key={svc.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-4 py-2.5 text-slate-700 text-sm">{svc.name}</td>
                    <td className="px-4 py-2.5 text-right text-sm font-mono text-slate-500">{fmtEuro(svc.gkvPrice)}</td>
                    <td className="px-4 py-2.5 text-right text-sm font-mono text-slate-400 hidden sm:table-cell">{fmtEuro(svc.gkvPrice * 1.4)}</td>
                    <td className="px-4 py-2.5 bg-emerald-50/20">
                      <input
                        type="number"
                        value={mult}
                        step={0.1}
                        min={1}
                        onChange={e => updatePkvOverride(svc.id, parseFloat(e.target.value) || 1.4)}
                        className="w-20 text-right bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 text-sm font-mono ml-auto block focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-sm font-mono text-slate-700">{fmtEuro(svc.gkvPrice * mult)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Count matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Behandlungsanzahl / Monat</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Behandlungen je Leistung und Mitarbeiter im Monat</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 min-w-[150px]">
                  Leistung
                </th>
                {employees.map(e => (
                  <th key={e.id} className="px-3 py-3 text-center text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50/40 min-w-[80px]">
                    {e.name || e.id}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider min-w-[70px]">Gesamt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((svc, idx) => (
                <tr key={svc.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                  <td className="px-4 py-2 text-slate-600 text-sm sticky left-0 bg-white border-r border-slate-100">{svc.name}</td>
                  {employees.map(e => (
                    <td key={e.id} className="px-3 py-1.5 bg-emerald-50/10">
                      <input
                        type="number"
                        value={getCount(svc.id, e.id) || ''}
                        min={0}
                        placeholder="0"
                        onChange={ev => updateServiceCount(svc.id, e.id, parseInt(ev.target.value) || 0)}
                        className="w-14 text-center bg-emerald-50 border border-emerald-200 rounded-lg px-1 py-1 text-sm font-mono mx-auto block focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors placeholder:text-slate-300"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-semibold text-sm font-mono text-slate-700 bg-slate-50">
                    {getTotalCount(svc.id) > 0 ? getTotalCount(svc.id) : <span className="text-slate-300">0</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
