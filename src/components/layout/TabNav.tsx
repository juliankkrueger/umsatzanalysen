const TABS = [
  { id: 'parameter',    label: 'Parameter',    short: 'Param.'  },
  { id: 'mitarbeiter',  label: 'Mitarbeiter',  short: 'MA'      },
  { id: 'leistungsmix', label: 'Leistungsmix', short: 'Leist.'  },
  { id: 'auswertung',   label: 'Auswertung',   short: 'Ausw.'   },
  { id: 'bep',          label: 'BEP-Analyse',  short: 'BEP'     },
];

interface TabNavProps {
  active: string;
  onChange: (tab: string) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-2 sm:px-4 flex overflow-x-auto shadow-sm">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
            active === tab.id
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="sm:hidden">{tab.short}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
