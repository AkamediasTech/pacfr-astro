import { useState } from "preact/hooks";

const CarouselDemoFormIsland = ({ steps }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [fieldIndex, setFieldIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  const currentStep = steps[stepIndex];
  const currentField = currentStep.fields[fieldIndex];
  const currentKey = currentStep.id + "." + currentField.id;

  const goToStep = (index, field = 0) => {
    setStepIndex(index);
    setFieldIndex(field);
    setMaxVisitedStep((prev) => Math.max(prev, index));
  };

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [currentKey]: value }));
    advance("next");
  };

  const advance = (direction) => {
    if (direction === "next") {
      const lastField = fieldIndex === currentStep.fields.length - 1;
      if (!lastField) {
        setFieldIndex((prev) => prev + 1);
        return;
      }

      if (stepIndex < steps.length - 1) {
        goToStep(stepIndex + 1, 0);
      }
      return;
    }

    if (fieldIndex > 0) {
      setFieldIndex((prev) => prev - 1);
      return;
    }

    if (stepIndex > 0) {
      const prevIndex = stepIndex - 1;
      const prevStep = steps[prevIndex];
      goToStep(prevIndex, prevStep.fields.length - 1);
    }
  };

  const isFinalField =
    stepIndex === steps.length - 1 &&
    fieldIndex === currentStep.fields.length - 1;

  const canGoToStep = (index) => {
    if (index === stepIndex) return true;
    if (index <= maxVisitedStep) return true;

    const step = steps[index];
    return step.fields.every((field) => {
      const key = step.id + "." + field.id;
      return Boolean(answers[key]);
    });
  };

  const handleStepClick = (index) => {
    if (!canGoToStep(index)) return;
    goToStep(index, 0);
  };

  const handleFinalize = () => {
    // TODO: replace with actual submission logic
    console.log("Final answers", answers);
  };

  return (
    <div class="flex flex-col gap-8 px-6 pb-8 pt-8 md:px-10">
      <header class="grid grid-cols-2 gap-4 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = index === stepIndex;
          const isComplete = step.fields.every((field) => {
            const key = step.id + "." + field.id;
            return Boolean(answers[key]);
          });
          const isLocked = !canGoToStep(index);

          const buttonClasses = [
            "group flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-white/0 px-2 py-2 text-center text-sm font-semibold transition",
            isActive
              ? "text-slate-900"
              : isComplete
              ? "text-slate-700"
              : "text-slate-400",
          ];
          if (isLocked && !isActive) {
            buttonClasses.push("cursor-not-allowed opacity-40");
          }

          const circleClasses = [
            "flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-bold transition",
          ];
          if (isActive) {
            circleClasses.push(
              "border-[#0097B2] bg-[#0097B2] text-white shadow-lg shadow-teal-500/30"
            );
          } else if (isComplete) {
            circleClasses.push("border-[#0097B2] bg-white text-[#0097B2]");
          } else {
            circleClasses.push(
              "border-slate-200 bg-white text-slate-400 group-hover:border-[#0097B2] group-hover:text-[#0097B2]"
            );
          }

          return (
            <button
              key={step.id}
              type="button"
              class={buttonClasses.join(" ")}
              onClick={() => handleStepClick(index)}
              disabled={isLocked && !isActive}
              aria-current={isActive ? "step" : undefined}
            >
              <span class={circleClasses.join(" ")}>{index + 1}</span>
              <span>{step.title}</span>
            </button>
          );
        })}
      </header>

      <div class="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
        {currentStep.subtitle ? (
          <h3 class="text-center text-xl font-semibold text-slate-800 md:text-2xl">
            {currentStep.subtitle}
          </h3>
        ) : null}

        {currentField.prompt ? (
          <p class="mt-3 text-center text-base text-slate-500 md:text-lg">
            {currentField.prompt}
          </p>
        ) : null}

        {/* Current Step Options */}
        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currentField.options.map((option) => {
            const isSelected = answers[currentKey] === option.value;
            const optionClasses = [
              "rounded-xl border px-4 py-4 text-center text-lg font-semibold transition shadow-sm hover:cursor-pointer hover:bg-[#0097B2]",
              isSelected
                ? "border-[#0097B2] bg-[#0097B2] text-white shadow-md shadow-teal-500/30"
                : "border-slate-200 bg-slate-100/80 text-slate-700 hover:border-[#0097B2] hover:bg-white hover:text-[#0097B2]",
            ];

            return (
              <button
                key={option.value}
                type="button"
                class={optionClasses.join(" ")}
                onClick={() => handleSelect(option.value)}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <footer class="flex items-center justify-between">
        {/* Previous Step Button */}
        <button
          type="button"
          class="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 transition hover:border-teal-300 hover:text-teal-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => advance("prev")}
          disabled={stepIndex === 0 && fieldIndex === 0}
        >
          Etape precedente
        </button>

        {/* Next Step or Finalize Button */}
        <button
          type="button"
          class="rounded-full bg-[#0097B2] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:bg-[#0097B2] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          onClick={() => (isFinalField ? handleFinalize() : advance("next"))}
          disabled={!answers[currentKey]}
        >
          {isFinalField ? "Finaliser" : "Etape suivante"}
        </button>
      </footer>
    </div>
  );
};

export default CarouselDemoFormIsland;
