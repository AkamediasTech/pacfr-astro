type SelectFieldProps = {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    options: string[];
    onChange: (next: string) => void;
    fullWidth?: boolean;
    required?: boolean;
};

export const SelectField = ({
    label,
    name,
    value,
    placeholder = "Sélectionnez une option",
    options,
    onChange,
    fullWidth,
    required,
}: SelectFieldProps) => {
    const hasOptions = options.length > 0;
    const placeholderLabel = hasOptions
        ? "Sélectionnez votre ville"
        : (placeholder ?? "Sélectionnez une option");

    return (
        <label
            class={`flex flex-col text-sm font-semibold text-slate-500 ${
                fullWidth ? "sm:col-span-2" : ""
            }`}
        >
            {label}
            <div class="relative mt-2">
                <select
                    name={name}
                    value={value}
                    required={required}
                    onChange={(event) => onChange(event.currentTarget.value)}
                    // class="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-700 shadow-sm focus:border-transparent focus:ring-4 focus:ring-[#4a90e2]/30 focus:outline-none"
                    class="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 shadow-sm transition focus:border-[#0a7cff] focus:ring-4 focus:ring-[#0a7cff]/20 focus:outline-none"
                    // class="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 shadow-sm transition hover:border-[#0a7cff] hover:bg-white focus:border-[#0a7cff] focus:ring-4 focus:ring-[#0a7cff]/20 focus:outline-none"
                >
                    <option value="" disabled hidden>
                        {placeholderLabel}
                    </option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                {/* <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    ▼
                </span> */}

                <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#0a7cff]">
                    <svg
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M5 7l5 5 5-5" />
                    </svg>
                </span>
            </div>
        </label>
    );
};
