import type { FunctionalComponent } from 'preact';
import type { FormStep as FormStepType } from './config';

type FormStepProps = {
  step: FormStepType;
  values: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
  onSubmit: (event: Event & { currentTarget: HTMLFormElement }) => void;
};

const FormStep: FunctionalComponent<FormStepProps> = ({ step, values, onFieldChange, onSubmit }) => (
  <form
    id="eligibility-step-form"
    class={`mt-8 space-y-5 ${step.fields.length > 2 ? 'grid gap-4 sm:grid-cols-2 sm:space-y-0' : ''}`}
    onSubmit={onSubmit}
  >
    {step.fields.map((field) => (
      <label
        key={field.name}
        class={`flex flex-col text-sm font-semibold text-slate-700 italic ${
          field.fullWidth ? 'sm:col-span-2' : ''
        }`}
      >
        {field.label}
        <input
          name={field.name}
          type={field.type ?? 'text'}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          required
          value={values[field.name] ?? ''}
          onInput={(event) => {
            const target = event.currentTarget as HTMLInputElement;
            onFieldChange(field.name, target.value);
          }}
          class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-4 focus:ring-[#4a90e2]/30"
        />
      </label>
    ))}
  </form>
);

export default FormStep;