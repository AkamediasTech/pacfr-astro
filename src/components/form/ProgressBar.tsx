import type { FunctionalComponent } from "preact";

type ProgressBarProps = {
    label: string;
    percent: number;
    visible?: boolean;
};

const ProgressBar: FunctionalComponent<ProgressBarProps> = ({
    label,
    percent,
    visible = true,
}) => {
    if (!visible) {
        return null;
    }

    const [labelText, percentText] = label.split("•");
    const formattedLabel = labelText?.trim() ?? "";
    const formattedPercent = percentText?.trim() ?? `${percent}%`;

    return (
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                <span class="text-brand-blue text-lg font-bold tracking-[0.1em] uppercase">
                    {labelText}
                </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                    class="bg-brand-gradient h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${formattedPercent}` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
