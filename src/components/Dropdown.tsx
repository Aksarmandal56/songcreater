interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function Dropdown({ label, value, onChange, options }: DropdownProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-black">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
