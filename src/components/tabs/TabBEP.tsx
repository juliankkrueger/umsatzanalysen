import { useAnalyseStore } from '../../store/useAnalyseStore';
import { useCalculations } from '../../hooks/useCalculations';
import { fmtEuro } from '../../utils/format';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0]?.value;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl px-3 py-2.5 text-sm">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Monat {label}</div>
        <div className={`text-base font-bold font-mono ${val >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {fmtEuro(val)}
        </div>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BepDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.bepMarker === null) return null;
  return <circle cx={cx} cy={cy} r={7} fill="#059669" stroke="white" strokeWidth={2.5} />;
};

export function TabBEP() {
  const bepState = useAnalyseStore(s => s.bep);
  const szenarioState = useAnalyseStore(s => s.szenario);
  const updateBep = useAnalyseStore(s => s.updateBep);
  const updateSzenario = useAnalyseStore(s => s.updateSzenario);
  const { bepSeries, bepMonth, results: calcResults } = useCalculations();

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">

      {/* Left: Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Break-Even-Parameter</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Investition und Zielwerte eingeben</p>
        </div>

        <div className="p-5 space-y-4">
          <Row label="Investition">
            <div className="relative">
              <input
                type="number"
                value={bepState.investition}
                onChange={e => updateBep({ investition: Number(e.target.value) })}
                className="w-full bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 pr-7 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">€</span>
            </div>
          </Row>
          <Row label="Szenario Mitarbeiter">
            <input
              type="number"
              value={szenarioState.mitarbeiterSzenario}
              onChange={e => updateSzenario({ mitarbeiterSzenario: Number(e.target.value) })}
              className="w-full bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
            />
          </Row>
          <Row label="Zielumsatz / MA / Monat">
            <div className="relative">
              <input
                type="number"
                value={szenarioState.zielumsatzProMA}
                onChange={e => updateSzenario({ zielumsatzProMA: Number(e.target.value) })}
                className="w-full bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 pr-7 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">€</span>
            </div>
          </Row>
          <Row label="Akt. Gesamtumsatz / Monat">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right text-slate-500 text-sm font-mono">
              {fmtEuro(calcResults.gesamtumsatzMonat)}
            </div>
          </Row>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Zeitraum</span>
              <span className="text-sm font-bold font-mono text-slate-700">{bepState.zeitraumMonate} Mon.</span>
            </div>
            <input
              type="range"
              min={6}
              max={60}
              value={bepState.zeitraumMonate}
              onChange={e => updateBep({ zeitraumMonate: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>6 Mon.</span><span>60 Mon.</span>
            </div>
          </div>
        </div>

        {/* BEP callout */}
        <div className={`mx-4 sm:mx-5 mb-4 sm:mb-5 rounded-xl p-4 text-center border ${
          bepMonth ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
        }`}>
          {bepMonth ? (
            <>
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-1">
                Break-Even erreicht
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-700">Monat {bepMonth}</div>
              <div className="text-[11px] text-emerald-500 mt-1">
                nach ca. {(bepMonth / 12).toFixed(1)} Jahren
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] font-semibold text-red-500 uppercase tracking-widest mb-1">
                Kein Break-Even
              </div>
              <div className="text-sm font-medium text-red-600">Parameter anpassen</div>
            </>
          )}
        </div>
      </div>

      {/* Right: Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Kumulierter Gewinn durch Mehrumsatz</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Neueinstellung / Kapazitätserweiterung</p>
        </div>
        <div className="p-3 sm:p-5">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={bepSeries} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="monat"
                label={{ value: 'Monat', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#94a3b8' }}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => {
                  const abs = Math.abs(v);
                  if (abs >= 1000) return `${(v / 1000).toFixed(0)}k`;
                  return String(v);
                }}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={42}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={0}
                stroke="#ef4444"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{ value: 'Break-Even', fontSize: 10, fill: '#ef4444', position: 'insideTopLeft' }}
              />
              <Line
                type="linear"
                dataKey="kumulierterGewinn"
                stroke="#059669"
                strokeWidth={2.5}
                dot={<BepDot />}
                activeDot={{ r: 5, fill: '#059669', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
