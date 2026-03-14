import { useAnalyseStore } from '../../store/useAnalyseStore';
import { useCalculations } from '../../hooks/useCalculations';
import { fmtEuro, fmtPercent, fmtNumber } from '../../utils/format';

export function TabMitarbeiter() {
  const { mitarbeiter, updateEmployee, addEmployee, removeEmployee, updateMitarbeiter } = useAnalyseStore();
  const { mitarbeiterSummary } = useCalculations();
  const { employees } = mitarbeiter;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-6xl mx-auto">

      {/* Top params */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 tracking-tight">Team-Parameter</h2>
        <div className="flex flex-wrap gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Neueinstellungen</label>
            <input
              type="number"
              value={mitarbeiter.neueinstellungen}
              onChange={e => updateMitarbeiter({ neueinstellungen: Number(e.target.value) })}
              className="w-20 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5 text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Fluktuation</label>
            <input
              type="number"
              value={mitarbeiter.fluktuationsrate * 100}
              onChange={e => updateMitarbeiter({ fluktuationsrate: Number(e.target.value) / 100 })}
              className="w-20 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5 text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
            />
            <span className="text-sm text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Employee table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Mitarbeiterdaten</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{employees.length} Einträge · grüne Felder editierbar</p>
          </div>
          <button
            onClick={addEmployee}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
          >
            + Hinzufügen
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 sm:px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12">ID</th>
                <th className="px-3 sm:px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-3 sm:px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Std./Wo.</th>
                <th className="px-3 sm:px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Umsatz/Mon.</th>
                <th className="px-3 sm:px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gehalt</th>
                <th className="px-3 sm:px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100">Gehalts-%</th>
                <th className="px-3 sm:px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100">€/Std.</th>
                <th className="w-8 bg-slate-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp, idx) => {
                const gehaltsanteil = emp.umsatzProMonat && emp.gehalt ? emp.gehalt / emp.umsatzProMonat : null;
                const umsatzStunde = emp.umsatzProMonat && emp.wochenstunden ? emp.umsatzProMonat / (emp.wochenstunden * 4.33) : null;
                return (
                  <tr key={emp.id} className={`hover:bg-slate-50/80 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-3 sm:px-4 py-2.5 text-[11px] text-slate-400 font-mono">{emp.id}</td>
                    <td className="px-3 sm:px-4 py-2.5">
                      <input
                        value={emp.name}
                        onChange={e => updateEmployee(emp.id, { name: e.target.value })}
                        placeholder="Name…"
                        className="bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors placeholder:text-slate-300"
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={emp.wochenstunden}
                        onChange={e => updateEmployee(emp.id, { wochenstunden: Number(e.target.value) })}
                        className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 w-16 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={emp.umsatzProMonat ?? ''}
                        onChange={e => updateEmployee(emp.id, { umsatzProMonat: e.target.value ? Number(e.target.value) : null })}
                        placeholder="0"
                        className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 w-24 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors placeholder:text-slate-300"
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={emp.gehalt ?? ''}
                        onChange={e => updateEmployee(emp.id, { gehalt: e.target.value ? Number(e.target.value) : null })}
                        placeholder="0"
                        className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 w-20 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors placeholder:text-slate-300"
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right text-sm font-mono bg-slate-50">
                      {gehaltsanteil !== null ? (
                        <span className={`font-semibold ${gehaltsanteil > 0.5 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {fmtPercent(gehaltsanteil)}
                        </span>
                      ) : <span className="text-slate-300">–</span>}
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right text-sm font-mono text-slate-500 bg-slate-50">
                      {umsatzStunde ? fmtEuro(umsatzStunde) : <span className="text-slate-300">–</span>}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <button
                        onClick={() => removeEmployee(emp.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors text-xs w-5 h-5 inline-flex items-center justify-center rounded hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white border-t-2 border-slate-700">
                <td colSpan={2} className="px-3 sm:px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  ∅ / Gesamt
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-sm font-mono font-semibold">
                  {fmtNumber(mitarbeiterSummary.gesamtWochenstunden)} h
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-sm font-mono font-semibold">
                  {fmtEuro(mitarbeiterSummary.avgUmsatzProMonat)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-sm font-mono font-semibold">
                  {fmtEuro(mitarbeiterSummary.avgGehalt)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-sm font-mono font-semibold">
                  {fmtPercent(mitarbeiterSummary.avgGehaltsanteil)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-sm font-mono font-semibold">
                  {fmtEuro(mitarbeiterSummary.avgUmsatzProStunde)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Prognose */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 tracking-tight">Team-Prognose</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Jahresumsatz Team</div>
            <div className="text-lg font-bold text-slate-800 font-mono">{fmtEuro(mitarbeiterSummary.jahresumsatz)}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ø Umsatz / Stunde</div>
            <div className="text-lg font-bold text-slate-800 font-mono">{fmtEuro(mitarbeiterSummary.avgUmsatzProStunde)}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 col-span-2 md:col-span-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Kum. MA-Umsatz (5 J.)</div>
            <div className="text-lg font-bold text-slate-800 font-mono">{fmtEuro(mitarbeiterSummary.avgUmsatzProMonat * 12 * 5)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
