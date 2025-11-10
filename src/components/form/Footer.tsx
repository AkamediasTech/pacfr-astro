import type { FunctionalComponent } from "preact";

type FooterProps = {
    canGoBack: boolean;
    onBack: () => void;
    showSubmit: boolean;
    submitLabel?: string;
    progressText: string;
};

const Footer: FunctionalComponent<FooterProps> = ({
    canGoBack,
    onBack,
    showSubmit,
    submitLabel,
    progressText,
}) => (
    <footer class="flex min-h-[72px] flex-row items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:px-8">
        {canGoBack ? (
            <button
                type="button"
                onClick={onBack}
                class="text-brand-blue inline-flex items-center justify-center rounded-[8px] border border-[rgba(18,100,193,0.25)] bg-transparent px-3 py-3 text-sm font-semibold transition hover:cursor-pointer hover:border-[rgba(18,100,193,0.4)] hover:bg-[rgba(18,100,193,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(18,100,193,0.4)] min-[380px]:px-6 sm:px-6 sm:py-3 lg:text-base"
            >
                Retour
            </button>
        ) : (
            <span />
        )}

        {showSubmit ? (
            <button
                type="submit"
                form="eligibility-step-form"
                class="btn btn-success btn--glow rounded-[8px] px-3 py-3 text-sm hover:cursor-pointer sm:px-6 sm:py-4"
            >
                {submitLabel ?? "Continuer"}
            </button>
        ) : (
            <p class="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase lg:text-base">
                {progressText}
            </p>
        )}
    </footer>
);

export default Footer;
