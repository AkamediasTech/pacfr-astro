import type { FunctionalComponent } from 'preact';

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
  <footer class="flex flex-row sm:flex-row gap-4 min-h-[72px] items-center justify-between border-t border-slate-200 px-6 py-4 sm:px-8">
    {canGoBack ? (
      <button
        type="button"
        onClick={onBack}
        class="inline-flex items-center justify-center rounded-[8px] border border-[rgba(18,100,193,0.25)] bg-transparent py-5 px-3 min-[380px]:px-6 sm:px-6 sm:py-3 
        text-sm lg:text-base font-semibold text-brand-blue transition hover:bg-[rgba(18,100,193,0.08)] hover:border-[rgba(18,100,193,0.4)] 
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(18,100,193,0.4)] hover:cursor-pointer"
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
        class="btn btn-success btn--glow px-6 py-5 sm:py-4 rounded-[8px] hover:cursor-pointer text-sm"
      >
        {submitLabel ?? 'Continuer'}
      </button>
    ) : (
      <p class="text-xs lg:text-base font-semibold uppercase tracking-[0.3em] text-slate-400">
        {progressText}
      </p>
    )}
  </footer>
);

export default Footer;