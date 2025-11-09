import type { FunctionalComponent } from "preact";
import type { ChoiceStep as ChoiceStepType } from "./config";
import { OPTION_ICONS } from "./config";

type ChoiceStepProps = {
    step: ChoiceStepType;
    selectedValue?: string;
    onSelect: (value: string) => void;
};

const ChoiceStep: FunctionalComponent<ChoiceStepProps> = ({
    step,
    selectedValue,
    onSelect,
}) => (
    <div class="mt-8 grid grid-cols-2 gap-4">
        {step.options.map((option) => {
            const Icon = option.icon ? OPTION_ICONS[option.icon] : null;
            const isActive = selectedValue === option.value;

            return (
                <button
                    key={option.value}
                    type="button"
                    class={`choice-tile ${isActive ? "choice-tile--active" : ""}`}
                    onClick={() => onSelect(option.value)}
                >
                    {Icon ? (
                        <span
                            class={`choice-tile__icon ${isActive ? "text-brand-blue" : "text-slate-500"}`}
                        >
                            {Icon}
                        </span>
                    ) : null}
                    <span>{option.label}</span>
                </button>
            );
        })}
    </div>
);

export default ChoiceStep;
