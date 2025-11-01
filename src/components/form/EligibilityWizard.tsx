import { useEffect, useMemo, useState } from 'preact/hooks';
import { ChecklistAnimator } from './ChecklistAnimator';
import { CHECKLIST_PHASES, PHASES } from './config';
import type { ChoiceOption, Step } from './config';
import type { JSX } from 'preact/jsx-runtime';

type ScreenState = 'step' | 'checklist' | 'summary';

const OPTION_ICONS: Record<NonNullable<ChoiceOption['icon']>, JSX.Element> = {
  apartment: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h2v2H9zM13 7h2v2h-2zM9 11h2v2H9zM13 11h2v2h-2zM9 15h6v4H9z" />
    </svg>
  ),
  house: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9h4v-5h6v5h4v-9" />
    </svg>
  ),
  tenant: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 14h8M8 10h5" />
    </svg>
  ),
  owner: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <circle cx="8" cy="15" r="3" />
      <path d="M17 3h4v4l-7 7" />
      <path d="M19 3 9 13" />
    </svg>
  ),
  oil: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M12 2s4 5 4 8a4 4 0 1 1-8 0c0-3 4-8 4-8z" />
    </svg>
  ),
  gas: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M12 2v6l3 3-3 3v8" />
      <path d="M9 18h6" />
    </svg>
  ),
  electricity: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  other: (
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M3 21c3-8 7-12 9-12s6 4 9 12" />
      <path d="M8 15h8" />
    </svg>
  ),
};

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

  const currentPhase = PHASES[phaseIndex];
  const currentStep = currentPhase.steps[stepIndex];

  const totalScreens = useMemo(
    () => PHASES.reduce((sum, phase) => sum + phase.steps.length + 2, 0),
    [],
  );

const canGoBack = !( 
    (phaseIndex === 0 && stepIndex === 0 && screen === 'step') || 
    (screen === 'summary' && currentPhase.isFinal) // Lorsque la soumission est finie
);

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

  const progressPercent = totalScreens > 1 ? Math.round((currentScreenIndex / (totalScreens - 1)) * 100) : 0;

    const progressText = `${progressPercent} %`;

    // Calcul du titre à afficher pour le header du card formulaire
    const computeHeader = () => {
        const base = {
            title: 'Calculez le montant de vos aides 2025',
            subtitle: 'Anah, CEE, MPR, Éco-PTZ',
            bgClass: 'bg-brand-blue',
        };

        if (screen === 'summary') {
            if (currentPhase.isFinal) {
                return {
                    title: 'Nous vous contacterons sous 24h',
                    subtitle: 'Un conseiller vous rappellera très prochainement.',
                    bgClass: 'bg-[#149f48]',
                };
            }

            return {
                title: 'Analyse de vos réponses',
                subtitle: 'Anah, CEE, MPR, Éco-PTZ',
                bgClass: base.bgClass,
            };
        }

        if (currentPhase.id === 'contact') {
            return {
            title: 'Votre estimation est prête',
            // subtitle: 'Renseignez vos coordonnées pour la recevoir.',
            subtitle: "Anah, CEE, MPR, Éco-PTZ",
            bgClass: 'bg-[#149f48]',
            };
        }

            return base;
    };

    const { title: headerTitle, 
            subtitle: headerSubtitle, 
            bgClass: headerBgClass } = computeHeader();

    const hasSubtitle = Boolean(headerSubtitle);


  const checklistItems =
    CHECKLIST_PHASES.find((item) => item.id === currentPhase.checklistId)?.messages.Aides ?? [];

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
    if (stepIndex < currentPhase.steps.length - 1) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    setScreen('checklist');
    setChecklistKey((prev) => prev + 1);
  };

  const handleChecklistComplete = () => {
    setScreen('summary');
  };

  const handleSummaryContinue = () => {
    if (currentPhase.isFinal) return;

    setPhaseIndex((prev) => prev + 1);
    setStepIndex(0);
    setScreen('step');
  };

  const handleReset = () => {
    setPhaseIndex(0);
    setStepIndex(0);
    setScreen('step');
    setAnswers({});
  };

    useEffect(() => {
        if (screen === 'summary' && !currentPhase.isFinal) {
        const timer = setTimeout(() => {
            setPhaseIndex((prev) => prev + 1);
            setStepIndex(0);
            setScreen('step');
        }, 1200);

            return () => clearTimeout(timer);
        }
      
    }, [screen, currentPhase.isFinal]);


  const handleBack = () => {

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
        // class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-4 focus:ring-[#1264c1]/30"
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
        <header class={`${headerBgClass} px-6 pb-6 pt-6 text-center text-white sm:px-8 transition-colors duration-500`}>
            <h1 class="text-xl font-semibold sm:text-2xl">{headerTitle}</h1>
            <p class={`mt-1 text-xs uppercase tracking-[0.4em] text-white/70 transition-opacity duration-300 ${
                    hasSubtitle ? 'opacity-100' : 'opacity-0'
                }`}
                >
                {headerSubtitle || '\u2007'}
            </p>
        </header>

    {/* Cache la barre de progression lorsqu'on est à 100% et la demande a été soumise/envoyée avec succès */}
    <div class="px-6 pt-6 sm:px-8">
        {!(screen === 'summary' && currentPhase.isFinal) ? (
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    <span class="text-lg font-bold uppercase tracking-[0.1em] text-brand-blue">
                        {progressText}
                    </span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                    <div
                        class="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        ) : null}
    </div>

      <div class="relative flex-1 px-6 pb-8 pt-4 sm:px-8">
    {/* <div class="relative flex-1 px-6 pb-8 pt-4 sm:px-8 min-h-[360px] sm:min-h-[320px]"> */}
        {screen === 'step' ? renderStepContent() : null}

        {screen === 'checklist' ? (
          <ChecklistAnimator
            items={checklistItems}
            playKey={`${currentPhase.id}-${checklistKey}`}
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