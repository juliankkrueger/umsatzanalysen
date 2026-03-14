import { useAnalyseStore } from '../../store/useAnalyseStore';
import type { Discipline } from '../../data/types';

const DISCIPLINES: { value: Discipline; label: string; short: string }[] = [
  { value: 'physio', label: 'Physiotherapie', short: 'Physio' },
  { value: 'ergo',   label: 'Ergotherapie',   short: 'Ergo'   },
  { value: 'logo',   label: 'Logopädie',      short: 'Logo'   },
];

export function DisciplineSelector() {
  const { discipline, setDiscipline } = useAnalyseStore();
  return (
    <div className="bg-slate-800 border-b border-slate-700/60 px-4 sm:px-6 py-2 flex items-center gap-1.5">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest self-center mr-2 hidden sm:block">
        Fachbereich
      </span>
      {DISCIPLINES.map(d => (
        <button
          key={d.value}
          onClick={() => setDiscipline(d.value)}
          className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ${
            discipline === d.value
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <span className="sm:hidden">{d.short}</span>
          <span className="hidden sm:inline">{d.label}</span>
        </button>
      ))}
    </div>
  );
}
