import { useState, useRef, useEffect } from "preact/hooks";

type CitySelectProps = {
    name: string;
    label: string;
    value: string;
    options: string[];
    onChange: (nextValue: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
};

export function CitySelect({
    name,
    label,
    value,
    options,
    onChange,
    placeholder = "Sélectionnez votre ville",
    fullWidth,
}: CitySelectProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasOptions = options.length > 0;
    const effectivePlaceholder = hasOptions
        ? "Sélectionnez votre ville"
        : placeholder;

    const displayText = open && !value ? "—" : value || effectivePlaceholder;

    // ferme le menu au clic en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (city: string) => {
        onChange(city);
        setOpen(false);
    };

    return (
        <div
            ref={containerRef}
            class={`relative flex flex-col text-sm font-semibold text-slate-500 ${
                fullWidth ? "sm:col-span-2" : ""
            }`}
        >
            <label for={name} class="mb-2">
                {label}
            </label>

            <button
                type="button"
                id={`${name}-trigger`}
                class="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-base font-medium text-slate-800 shadow-sm transition focus:ring-4 focus:ring-[#4a90e2]/30 focus:outline-none"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
            >
                {/* <span>{value || placeholder}</span> */}
                <span>{displayText}</span>
                <svg
                    class="h-4 w-4 text-slate-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M5 7l5 5 5-5" />
                </svg>
            </button>

            {open ? (
                // <ul
                //     role="listbox"
                //     aria-labelledby={`${name}-trigger`}
                //     class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                // >
                <ul
                    class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                    role="listbox"
                    aria-labelledby={`${name}-trigger`}
                >
                    {options.length === 0 ? (
                        <li class="px-4 py-2 text-sm text-slate-500">
                            Aucune ville disponible
                        </li>
                    ) : (
                        options.map((city) => (
                            <li
                                key={city}
                                role="option"
                                aria-selected={city === value}
                                class={`cursor-pointer px-4 py-2 text-sm transition hover:bg-slate-100 ${
                                    city === value
                                        ? "bg-slate-50 font-semibold text-[#0a7cff]"
                                        : "text-slate-700"
                                }`}
                                onClick={() => handleSelect(city)}
                            >
                                {city}
                            </li>
                        ))
                    )}
                </ul>
            ) : null}
        </div>
    );
}
