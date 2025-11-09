import type { FunctionalComponent } from "preact";

type PhaseSummaryProps = {
    successMessage: string;
    isFinal: boolean;
    onReset: () => void;
    nextPhaseMessage?: string;
    finalMessage?: string;
};

const PhaseSummary: FunctionalComponent<PhaseSummaryProps> = ({
    successMessage,
    isFinal,
    onReset,
    nextPhaseMessage = "Passons à l’étape suivante pour finaliser votre estimation.",
    finalMessage = "Merci ! Vous serez contacté rapidement pour finaliser votre dossier.",
}) => (
    <div class="mt-12 flex flex-col items-center gap-6 text-center">
        <div class="animate-scale-in rounded-full bg-emerald-500/15 p-5">
            <svg
                class="h-12 w-12 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
            >
                <path d="M20 6 9 17l-5-5" />
            </svg>
        </div>
        <div>
            <p class="text-brand-blue text-lg font-semibold">
                {successMessage}
            </p>
            <p class="mt-2 text-sm text-slate-500">
                {isFinal ? finalMessage : nextPhaseMessage}
            </p>
        </div>

        {isFinal ? (
            <button
                type="button"
                onClick={onReset}
                class="btn btn-success btn--glow px-6 py-3 hover:cursor-pointer"
            >
                Recommencer une simulation
            </button>
        ) : null}
    </div>
);

export default PhaseSummary;
