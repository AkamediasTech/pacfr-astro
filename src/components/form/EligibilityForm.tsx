import { useRef, useMemo, useState, useEffect } from "preact/hooks";
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

const fetchCitiesByPostalCode = async (
    postalCode: string
): Promise<string[]> => {
    if (!/^\d{5}$/.test(postalCode)) {
        return [];
    }

    try {
        const response = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom&format=json`
        );

        if (!response.ok) {
            throw new Error(`Erreur réseau (${response.status})`);
        }

        const data: Array<{ nom: string }> = await response.json();
        return data.map((ville) => ville.nom);
    } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error);
        return [];
    }
};

const sendS2SPixelIfNeeded = (answers: Record<string, string>) => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const varOc = params.get("var_oc");
    if (!varOc) return;

    if (answers.ownership === "tenant") return;
    if (answers.propertyType === "apartment") return;

    fetch(
        `https://publisher.api.optincollect.com/s2s/lead.json?uid=auto&s2s=${encodeURIComponent(varOc)}`
    )
        .then((res) => {
            if (res.ok) {
                console.log("Pixel S2S envoyé avec succès.");
            } else {
                console.warn(
                    "Erreur lors de l'envoi du pixel S2S :",
                    res.status
                );
            }
        })
        .catch((error) => console.error("Erreur requête S2S :", error));
};

export default function EligibilityForm() {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [screen, setScreen] = useState<ScreenState>("step");
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [checklistKey, setChecklistKey] = useState(0);
    const autoAdvanceTimerRef = useRef<number | null>(null);
    const [submissionError, setSubmissionError] = useState<{
        title: string;
        description: string;
    } | null>(null);
    const [cityOptions, setCityOptions] = useState<string[]>([]);

    // useEffect(() => {
    //     setSubmissionError({
    //         title: "Simulation d’erreur",
    //         description:
    //             "Ceci est un test visuel pour vérifier le rendu de l’alerte.",
    //     });
    // }, []);

    useEffect(() => {
        const postalCode = answers["postal-code"];

        console.log("useEffect postalCode:", postalCode);
        console.log("useEffect postalCode.length:", postalCode?.length);

        if (!postalCode || postalCode.length !== 5) {
            setCityOptions([]);
            return;
        }

        fetchCitiesByPostalCode(postalCode).then((cities) => {
            console.log("useEffect cities:", cities);
            setCityOptions(cities);
            if (cities.length === 0) {
                setAnswers((prev) => ({ ...prev, "address-level2": "" }));
            }
        });
    }, [answers["postal-code"]]);

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

            // goToNextStep();
            // return;

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
                sendS2SPixelIfNeeded(mergedAnswers);
                goToNextStep();
                // TODO: appeler sendS2SPixelIfNeeded()/finalizeForm equivalents si nécessaire
            } catch (error) {
                console.error("Erreur lors de l'envoi du formulaire:", error);
                handleSubmissionError({
                    description:
                        "Nous n’avons pas pu soumettre votre formulaire. Actualisez la page ou essayez à nouveau.",
                });
                // TODO: afficher un feedback utilisateur ou gérer l’échec comme finaliseFormError
            }
        };

    const handleSubmissionError = (opts?: {
        title?: string;
        description?: string;
    }) => {
        setSubmissionError({
            title: opts?.title ?? "Une erreur est survenue",
            description:
                opts?.description ??
                "Impossible d’envoyer votre demande pour le moment. Merci de réessayer dans quelques instants ou de vérifier votre connexion.",
        });
        setScreen("step"); // on reste sur la saisie courante
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
                    selectOptions={{ "address-level2": cityOptions }}
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

                {submissionError ? (
                    <div class="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <svg
                            class="h-10 w-10 text-red-500"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path
                                d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 "
                                stroke="none"
                                fill-rule="evenodd"
                                fill="#FF0000"
                            ></path>
                        </svg>
                        <div>
                            <p class="font-semibold">{submissionError.title}</p>
                            <p class="mt-1 text-sm">
                                {submissionError.description}
                            </p>
                        </div>
                    </div>
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
