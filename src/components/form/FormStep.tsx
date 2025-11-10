import type { FunctionalComponent } from "preact";
import type { FormStep as FormStepType } from "./config";

type FormStepProps = {
    step: FormStepType;
    values: Record<string, string>;
    onFieldChange: (fieldName: string, value: string) => void;
    onSubmit: (event: Event & { currentTarget: HTMLFormElement }) => void;
};

const FormStep: FunctionalComponent<FormStepProps> = ({
    step,
    values,
    onFieldChange,
    onSubmit,
}) => (
    <form
        id="eligibility-step-form"
        class={`mt-8 space-y-5 ${step.fields.length > 2 ? "grid gap-4 sm:grid-cols-2 sm:space-y-0" : ""}`}
        onSubmit={onSubmit}
    >
        {step.fields.map((field) => {
            const isCheckbox = field.type === "checkbox";
            const currentValue = values[field.name];

            if (isCheckbox) {
                const isChecked = (currentValue ?? "on") === "on";

                return (
                    <label
                        key={field.name}
                        class={`flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 ${
                            field.fullWidth ? "sm:col-span-2" : ""
                        }`}
                    >
                        <input
                            name={field.name}
                            type="checkbox"
                            checked={isChecked}
                            onInput={(event) => {
                                const target =
                                    event.currentTarget as HTMLInputElement;
                                onFieldChange(
                                    field.name,
                                    target.checked ? "on" : "off"
                                );
                            }}
                            class="text-brand-blue focus:ring-brand-blue/40 h-5 w-5 rounded border-slate-300"
                        />
                        <span class="leading-tight">{field.label}</span>
                    </label>
                );
            }

            return (
                <label
                    key={field.name}
                    class={`flex flex-col text-sm font-semibold text-slate-500 ${
                        field.fullWidth ? "sm:col-span-2" : ""
                    }`}
                >
                    {field.label}
                    <input
                        name={field.name}
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        maxLength={field.maxLength}
                        required
                        value={currentValue ?? ""}
                        onInput={(event) => {
                            const target =
                                event.currentTarget as HTMLInputElement;
                            onFieldChange(field.name, target.value);
                        }}
                        class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-500 shadow-sm focus:border-transparent focus:ring-4 focus:ring-[#4a90e2]/30 focus:outline-none"
                    />
                </label>
            );
        })}
    </form>
);

export default FormStep;
