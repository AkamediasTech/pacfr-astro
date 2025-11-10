import { useRef, useMemo, useState } from "preact/hooks";
import { ChecklistAnimator } from "./ChecklistAnimator";
import { PHASES, DEFAULT_HEADER_STEP } from "./config";
import type { Step } from "./config";
import PhaseHeader from "./PhaseHeader";
import ProgressBar from "./ProgressBar";
import PhaseSummary from "./PhaseSummary";
import ChoiceStep from "./ChoiceStep";
import FormStep from "./FormStep";
import Footer from "./Footer";

type ScreenState = "step" | "checklist" | "summary";

function isChoiceStep(step: Step): step is Extract<Step, { type: "choice" }> {
    return step.type === "choice";
}

function isFormStep(step: Step): step is Extract<Step, { type: "form" }> {
    return step.type === "form";
}

const FIELD_KEY_MAPPING: Record<string, string> = {
    propertyType: "step1",
    ownership: "step2",
    heating: "step3",
    surface: "step4",
    "postal-code": "codePostal",
    "address-level2": "Ville",
    "given-name": "prenom",
    "family-name": "nom",
    tel: "telephone",
    email: "email",
};

const FIELD_VALUE_MAPPING: Record<string, Record<string, string>> = {
    propertyType: {
        apartment: "Appartement",
        house: "Maison",
    },
    ownership: {
        tenant: "Locataire",
        owner: "Propriétaire",
    },
    heating: {
        oil: "Fioul",
        gas: "Gaz",
        electricity: "Électricité",
        other: "Autres",
    },
    surface: {
        "0-100": "0-100m2",
        "100-150": "100-150m2",
        "150-200": "150-200m2",
        "200+": "200m2+",
    },
    consent: {
        on: "Oui",
        off: "Non",
    },
};

// const mapAnswersForSubmission = (
//     answers: Record<string, string>
// ): Record<string, string> => {
//     const mapped: Record<string, string> = {};

//     Object.entries(answers).forEach(([key, value]) => {
//         const targetKey = FIELD_KEY_MAPPING[key] ?? key;
//         mapped[targetKey] = value;
//     });

//     return mapped;
// };

const mapAnswersForSubmission = (
    answers: Record<string, string>
): Record<string, string> => {
    const mapped: Record<string, string> = {};

    Object.entries(answers).forEach(([field, rawValue]) => {
        const targetKey = FIELD_KEY_MAPPING[field] ?? field;
        const mappedValue =
            FIELD_VALUE_MAPPING[field]?.[rawValue] ?? rawValue ?? "";

        mapped[targetKey] = mappedValue;
    });

    return mapped;
};

const buildSubmissionFormData = (answers: Record<string, string>) => {
    const mappedAnswers = mapAnswersForSubmission(answers);
    const formData = new FormData();

    Object.entries(mappedAnswers).forEach(([key, value]) => {
        formData.append(key, value ?? "");
    });

    return formData;
};

export default function EligibilityForm() {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [screen, setScreen] = useState<ScreenState>("step");
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

        if (screen === "summary") {
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
        []
    );

    // Calculer le libellé et l’affichage de la barre de progression
    const currentScreenIndex = useMemo(() => {
        let offset = 0;

        for (let i = 0; i < phaseIndex; i += 1) {
            offset += PHASES[i].steps.length + 2;
        }

        if (screen === "step") {
            offset += stepIndex;
        } else if (screen === "checklist") {
            offset += currentPhase.steps.length;
        } else {
            offset += currentPhase.steps.length + 1;
        }

        return offset;
    }, [phaseIndex, stepIndex, screen, currentPhase]);

    const progressPercent =
        totalScreens > 1
            ? Math.round((currentScreenIndex / (totalScreens - 1)) * 100)
            : 0;

    const shouldShowProgress = !(screen === "summary" && currentPhase.isFinal);

    const progressLabel =
        screen === "checklist" ||
        (screen === "summary" && !currentPhase.isFinal)
            ? (currentPhase.progress?.checklistLabel ??
              currentPhase.progress?.stepLabel ??
              `Phase ${phaseIndex + 1}`)
            : (currentPhase.progress?.stepLabel ?? `Phase ${phaseIndex + 1}`);

    // const progressText = `${progressLabel} • ${progressPercent} %`;
    const progressText = `${progressPercent} %`;

    const canGoBack = !(
        (phaseIndex === 0 && stepIndex === 0 && screen === "step") ||
        (screen === "summary" && currentPhase.isFinal) // Lorsque la soumission est finie
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
            setScreen("step");
            autoAdvanceTimerRef.current = null;
        }, delay);
    };

    const handleChoice = (stepId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [stepId]: value }));
        goToNextStep();
    };

    const logFormData = (formData: FormData) => {
        const payloadPreview: Record<string, FormDataEntryValue> = {};
        formData.forEach((value, key) => {
            payloadPreview[key] = value;
        });
        console.log("Payload envoyé :", payloadPreview);
    };

    const N8N_WEBHOOK_URL =
        "https://techaka.app.n8n.cloud/webhook/8ed7e6eb-317b-42cf-9826-68b1680efa0d";

    const handleFormSubmit =
        (step: Extract<Step, { type: "form" }>) =>
        async (event: Event & { currentTarget: HTMLFormElement }) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const nextValues: Record<string, string> = {};

            step.fields.forEach((field) => {
                const rawValue = formData.get(field.name);
                nextValues[field.name] =
                    typeof rawValue === "string" ? rawValue.trim() : "";
            });

            setAnswers((prev) => ({ ...prev, ...nextValues }));

            console.log("Answers:", answers);

            const mergedAnswers = { ...answers, ...nextValues };
            setAnswers(mergedAnswers);

            const payload = new FormData();
            Object.entries(mergedAnswers).forEach(([key, value]) => {
                payload.append(key, value);
            });

            logFormData(payload);

            const submissionPayload = buildSubmissionFormData(mergedAnswers);

            console.log("submissionPayload:");
            logFormData(submissionPayload);

            goToNextStep();

            return;

            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    body: payload,
                });

                const contentType = response.headers.get("content-type") ?? "";
                const responseBody = contentType.includes("application/json")
                    ? await response.json().catch(() => null)
                    : await response.text().catch(() => null);

                if (!response.ok) {
                    throw new Error(
                        `Erreur réseau (${response.status}): ${
                            responseBody ?? "Réponse invalide"
                        }`
                    );
                }

                console.log("Données envoyées:", responseBody);
                goToNextStep();
                // TODO: appeler sendS2SPixelIfNeeded()/finalizeForm equivalents si nécessaire
            } catch (error) {
                console.error("Erreur lors de l'envoi du formulaire:", error);
                // TODO: afficher un feedback utilisateur ou gérer l’échec comme finaliseFormError
            }
        };

    const goToNextStep = () => {
        clearAutoAdvanceTimer();

        if (stepIndex < currentPhase.steps.length - 1) {
            setStepIndex((prev) => prev + 1);
            return;
        }

        setScreen("checklist");
        setChecklistKey((prev) => prev + 1);
    };

    const handleChecklistComplete = () => {
        setScreen("summary");
        scheduleNextPhaseIfNeeded();
    };

    const handleReset = () => {
        clearAutoAdvanceTimer();
        setPhaseIndex(0);
        setStepIndex(0);
        setScreen("step");
        setAnswers({});
    };

    const goToPreviousStep = () => {
        // Si on est déjà sur l'écran de validation, on revient directement
        // à la dernière étape de la phase sans repasser par la checklist.
        if (screen === "summary") {
            setScreen("step");
            setStepIndex(currentPhase.steps.length - 1);
            return;
        }

        // Si la checklist est en cours, on interrompt l'animation et on
        // remonte sur la dernière étape de saisie.
        if (screen === "checklist") {
            setScreen("step");
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
            setScreen("step");
        }
    };

    const handleBack = () => {
        clearAutoAdvanceTimer();
        goToPreviousStep();
    };

    const renderStepContent = () => (
        <>
            <h2 class="text-md text-brand-blue font-semibold tracking-[0.1em] uppercase sm:text-xl">
                {currentStep.title}
            </h2>

            {currentStep.subtitle ? (
                <p class="mt-2 text-sm text-slate-500">
                    {currentStep.subtitle}
                </p>
            ) : null}

            {isChoiceStep(currentStep) ? (
                <ChoiceStep
                    step={currentStep}
                    selectedValue={answers[currentStep.id]}
                    onSelect={(value) => handleChoice(currentStep.id, value)}
                />
            ) : null}

            {isFormStep(currentStep) ? (
                <FormStep
                    step={currentStep}
                    values={answers}
                    onFieldChange={(name, value) =>
                        setAnswers((prev) => ({ ...prev, [name]: value }))
                    }
                    onSubmit={handleFormSubmit(currentStep)}
                />
            ) : null}
        </>
    );

    const successMessage =
        typeof currentPhase.successMessage === "function"
            ? currentPhase.successMessage(answers)
            : currentPhase.successMessage;

    return (
        <section class="mx-auto flex h-full min-h-fit w-[100%] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_30px_60px_-20px_rgba(10,63,149,0.35)] sm:min-h-[560px] sm:w-full">
            <PhaseHeader content={headerContent} />

            <div class="px-6 pt-6 sm:px-8">
                <ProgressBar
                    label={progressText}
                    percent={progressPercent}
                    visible={shouldShowProgress}
                />
            </div>

            <div class="relative flex-1 px-6 pt-4 pb-8 sm:px-8">
                {screen === "step" ? renderStepContent() : null}

                {screen === "checklist" ? (
                    <ChecklistAnimator
                        items={checklistItems}
                        playKey={`${currentPhase.id}-${checklistKey}`}
                        animationTiming={
                            currentPhase.checklistAnimation
                                ? {
                                      minDelayMs:
                                          currentPhase.checklistAnimation
                                              .minDelayMs,
                                      maxDelayMs:
                                          currentPhase.checklistAnimation
                                              .maxDelayMs,
                                  }
                                : undefined
                        }
                        onComplete={handleChecklistComplete}
                    />
                ) : null}

                {screen === "summary" ? (
                    <PhaseSummary
                        successMessage={successMessage}
                        isFinal={currentPhase.isFinal ?? false}
                        onReset={handleReset}
                    />
                ) : null}
            </div>

            <Footer
                canGoBack={canGoBack}
                onBack={handleBack}
                showSubmit={screen === "step" && isFormStep(currentStep)}
                submitLabel={
                    isFormStep(currentStep)
                        ? currentStep.submitLabel
                        : undefined
                }
                progressText={`Étape ${phaseIndex + 1} / ${PHASES.length}`}
            />
        </section>
    );
}
