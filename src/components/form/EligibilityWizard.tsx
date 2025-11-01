import { useRef, useMemo, useState } from 'preact/hooks';
import { ChecklistAnimator } from './ChecklistAnimator';
import { PHASES, DEFAULT_HEADER_STEP, OPTION_ICONS} from './config';
import type { Step } from './config';
import PhaseHeader from './PhaseHeader';
import ProgressBar from './ProgressBar';

type ScreenState = 'step' | 'checklist' | 'summary';


function isChoiceStep(step: Step): step is Extract<Step, { type: 'choice' }> {
  return step.type === 'choice';
}

function isFormStep(step: Step): step is Extract<Step, { type: 'form' }> {
  return step.type === 'form';
}

export default function EligibilityWizard() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [screen, setScreen] = useState<ScreenState>('step');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checklistKey, setChecklistKey] = useState(0);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const currentPhase = PHASES[phaseIndex];
  if (!currentPhase) {
    return null;
  }
  const currentStep = currentPhase.steps[stepIndex];
  if (!currentStep) {
    return null;
  }


const resolveHeaderContent = () => {
  const { header } = currentPhase;

  if (screen === 'summary') {
    if (currentPhase.isFinal && header.final) {
      return header.final;
    }
    return header.summary ?? header.step;
  }

  return header.step;
};

const headerContent = resolveHeaderContent() ?? DEFAULT_HEADER_STEP;

const checklistItems = currentPhase.checklistMessages ?? [];

  const totalScreens = useMemo(
    () => PHASES.reduce((sum, phase) => sum + phase.steps.length + 2, 0),
    [],
  );


// Calculer le libellé et l’affichage de la barre de progression
const currentScreenIndex = useMemo(() => {
let offset = 0;

for (let i = 0; i < phaseIndex; i += 1) {
    offset += PHASES[i].steps.length + 2;
}

if (screen === 'step') {
    offset += stepIndex;
} else if (screen === 'checklist') {
    offset += currentPhase.steps.length;
} else {
    offset += currentPhase.steps.length + 1;
}

return offset;
}, [phaseIndex, stepIndex, screen, currentPhase]);

const progressPercent =
totalScreens > 1 ? Math.round((currentScreenIndex / (totalScreens - 1)) * 100) : 0;

const shouldShowProgress = !(screen === 'summary' && currentPhase.isFinal);

const progressLabel =
screen === 'checklist' || (screen === 'summary' && !currentPhase.isFinal)
    ? currentPhase.progress?.checklistLabel ?? currentPhase.progress?.stepLabel ?? `Phase ${phaseIndex + 1}`
    : currentPhase.progress?.stepLabel ?? `Phase ${phaseIndex + 1}`;

// const progressText = `${progressLabel} • ${progressPercent} %`;
const progressText = `${progressPercent} %`;


const canGoBack = !( 
    (phaseIndex === 0 && stepIndex === 0 && screen === 'step') || 
    (screen === 'summary' && currentPhase.isFinal) // Lorsque la soumission est finie
);


const clearAutoAdvanceTimer = () => {
  if (autoAdvanceTimerRef.current !== null) {
    window.clearTimeout(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = null;
  }
};

const scheduleNextPhaseIfNeeded = () => {
  clearAutoAdvanceTimer();

  if (currentPhase.isFinal) return;

  const delay = currentPhase.progress?.autoAdvanceDelayMs ?? 1200;
  if (!delay) return;

  autoAdvanceTimerRef.current = window.setTimeout(() => {
    setPhaseIndex((prev) => prev + 1);
    setStepIndex(0);
    setScreen('step');
    autoAdvanceTimerRef.current = null;
  }, delay);
};

  const handleChoice = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    goToNextStep();
    };

const handleFormSubmit =
  (step: Extract<Step, { type: 'form' }>) =>
  (event: Event & { currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextValues: Record<string, string> = {};

    step.fields.forEach((field) => {
      const rawValue = formData.get(field.name);
      nextValues[field.name] = typeof rawValue === 'string' ? rawValue.trim() : '';
    });

    setAnswers((prev) => ({ ...prev, ...nextValues }));
    goToNextStep();
  };

const goToNextStep = () => {
  clearAutoAdvanceTimer();

  if (stepIndex < currentPhase.steps.length - 1) {
    setStepIndex((prev) => prev + 1);
    return;
  }

  setScreen('checklist');
  setChecklistKey((prev) => prev + 1);
};

  const handleChecklistComplete = () => {
    setScreen('summary');
    scheduleNextPhaseIfNeeded();
  };

  const handleReset = () => {
    clearAutoAdvanceTimer();
    setPhaseIndex(0);
    setStepIndex(0);
    setScreen('step');
    setAnswers({});
  };

  const goToPreviousStep = () => {

    // Si on est déjà sur l'écran de validation, on revient directement
    // à la dernière étape de la phase sans repasser par la checklist.
    if (screen === 'summary') {
    //   setScreen('checklist');
      setScreen('step');
      setStepIndex(currentPhase.steps.length - 1);
      return;
    }

    // Si la checklist est en cours, on interrompt l'animation et on
    // remonte sur la dernière étape de saisie.
    if (screen === 'checklist') {
      setScreen('step');
      setStepIndex(currentPhase.steps.length - 1);
      return;
    }

    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
      return;
    }

    if (phaseIndex > 0) {
      const previousPhase = PHASES[phaseIndex - 1];
      setPhaseIndex((prev) => prev - 1);
      setStepIndex(previousPhase.steps.length - 1);
      setScreen('step');
    }
  };

  const handleBack = () => {
    clearAutoAdvanceTimer();
    goToPreviousStep();
  }

const renderChoiceStep = (step: Extract<Step, { type: 'choice' }>) => {
  const selected = answers[step.id];

  return (
    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      {step.options.map((option) => {
        const isActive = selected === option.value;

        return (
        <button
            key={option.value}
            type="button"
            class={`choice-tile ${isActive ? 'choice-tile--active' : ''}`}
            onClick={() => handleChoice(step.id, option.value)}
          >
            {option.icon ? (
              <span class={`choice-tile__icon ${isActive ? 'text-brand-blue' : 'text-slate-500'}`}>
                {OPTION_ICONS[option.icon]}
              </span>
            ) : null}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const renderFormStep = (step: Extract<Step, { type: 'form' }>) => (
  <form
    id="eligibility-step-form"
    class={`mt-8 space-y-5 ${step.fields.length > 2 ? 'grid gap-4 sm:grid-cols-2 sm:space-y-0' : ''}`}
    onSubmit={handleFormSubmit(step) as any}
  >
    {step.fields.map((field) => (
      <label
        key={field.name}
        class={`flex flex-col text-sm font-semibold text-slate-600 ${
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
          value={answers[field.name] ?? ''}
          onInput={(event) => {
            const target = event.currentTarget as HTMLInputElement;
            setAnswers((prev) => ({ ...prev, [field.name]: target.value }));
          }}
        class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-4 focus:ring-[#4a90e2]/30"
        />
      </label>
    ))}
  </form>
);


  const renderStepContent = () => (
    <>
      <h2 class="text-xl font-semibold uppercase tracking-[0.15em] text-brand-blue">
        {currentStep.title}
      </h2>
      {currentStep.subtitle ? (
        <p class="mt-2 text-sm text-slate-500">{currentStep.subtitle}</p>
      ) : null}
      {isChoiceStep(currentStep) ? renderChoiceStep(currentStep) : null}
      {isFormStep(currentStep) ? renderFormStep(currentStep) : null}
    </>
  );

  const successMessage =
    typeof currentPhase.successMessage === 'function'
      ? currentPhase.successMessage(answers)
      : currentPhase.successMessage;

  return (
    <section class="flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_30px_60px_-20px_rgba(10,63,149,0.35)]">
        <PhaseHeader content={headerContent} />

    <div class="px-6 pt-6 sm:px-8">
        <ProgressBar label={progressText} percent={progressPercent} visible={shouldShowProgress} />
    </div>

      <div class="relative flex-1 px-6 pb-8 pt-4 sm:px-8">
        {screen === 'step' ? renderStepContent() : null}

        {screen === 'checklist' ? (
          <ChecklistAnimator
            items={checklistItems}
            playKey={`${currentPhase.id}-${checklistKey}`}
            animationTiming={
                currentPhase.checklistAnimation
                ? {
                    minDelayMs: currentPhase.checklistAnimation.minDelayMs,
                    maxDelayMs: currentPhase.checklistAnimation.maxDelayMs,
                    }
                : undefined
            }
            onComplete={handleChecklistComplete}
          />
        ) : null}

        {screen === 'summary' ? (
          <div class="mt-12 flex flex-col items-center gap-6 text-center">
            <div class="animate-scale-in rounded-full bg-emerald-500/15 p-5">
              <svg class="h-12 w-12 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p class="text-lg font-semibold text-brand-blue">{successMessage}</p>
              {!currentPhase.isFinal ? (
                <p class="mt-2 text-sm text-slate-500">
                  Passons à l’étape suivante pour finaliser votre estimation.
                </p>
              ) : (
                <p class="mt-2 text-sm text-slate-500">
                  Merci ! Vous serez contacté rapidement pour finaliser votre dossier.
                </p>
              )}
            </div>

            {currentPhase.isFinal ? (
                <button type="button" onClick={handleReset} class="btn btn-success btn--glow px-6 py-3 hover:cursor-pointer">
                    Recommencer une simulation
                </button>
            ) : null}

          </div>
        ) : null}
      </div>

      <footer class="flex min-h-[72px] items-center justify-between border-t border-slate-200 px-6 py-4 sm:px-8">

        {/* ghost arrondi */}
        {canGoBack ? (
            <button
                type="button"
                onClick={handleBack}
                class="inline-flex items-center justify-center rounded-full border border-[rgba(18,100,193,0.25)] bg-transparent px-8 py-3 text-sm font-semibold text-brand-blue transition hover:bg-[rgba(18,100,193,0.08)] hover:border-[rgba(18,100,193,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(18,100,193,0.4)] hover:cursor-pointer gap-2"
            >
                Retour

            </button>
            ) : (
            <span />
        )}

        {screen === 'step' && isFormStep(currentStep) ? (
          <button type="submit" form="eligibility-step-form" class="btn btn-success btn--glow px-6 py-3 hover:cursor-pointer">
            {currentStep.submitLabel}
          </button>
        ) : (
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Etape {phaseIndex + 1} / {PHASES.length}
          </p>
        )}
      </footer>
    </section>
  );
}