interface NumInputProps {
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  placeholder?: string;
  suffix?: string;
  disabled?: boolean;
}

export function NumInput({
  value, onChange, min, max, step = 1,
  className = '', placeholder, suffix, disabled,
}: NumInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.');
    const n = parseFloat(raw);
    if (!isNaN(n)) onChange(n);
    else if (e.target.value === '' || e.target.value === '-') onChange(0);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        value={value === null ? '' : value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-right w-full text-sm font-mono
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
          disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:border-slate-200
          transition-colors ${suffix ? 'pr-7' : ''} ${className}`}
      />
      {suffix && (
        <span className="absolute right-3 text-slate-400 text-xs pointer-events-none select-none">{suffix}</span>
      )}
    </div>
  );
}
