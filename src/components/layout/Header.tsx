import { useAnalyseStore } from '../../store/useAnalyseStore';
import { useCalculations } from '../../hooks/useCalculations';
import { exportToXlsx } from '../../export/exportToXlsx';

export function Header() {
  const { discipline, basisdaten, mitarbeiter, umsatzverteilung, szenario, bep } = useAnalyseStore();
  const { results, szenarioResults, bepSeries } = useCalculations();

  const handleExport = () => {
    exportToXlsx({ discipline, basisdaten, results, mitarbeiter, umsatzverteilung, szenario, bep, bepSeries, szenarioResults });
  };

  return (
    <header className="bg-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-[17px] font-bold text-white leading-tight tracking-tight">
            Umsatzpotenzialanalyse
          </h1>
          <p className="text-[11px] text-slate-400 leading-none mt-0.5">Agentur Krüger GmbH · Heilmittelbranche</p>
        </div>
      </div>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Als Google Sheets exportieren</span>
        <span className="sm:hidden">.xlsx</span>
      </button>
    </header>
  );
}
