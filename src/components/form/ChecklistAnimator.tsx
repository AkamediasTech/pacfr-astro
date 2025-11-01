import { useEffect, useState } from 'preact/hooks';

type ChecklistAnimatorProps = {
  items: string[];
  playKey: string;
  animationTiming?: {minDelayMs: number, maxDelayMs: number};
  onComplete?: () => void;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function ChecklistAnimator({ items, playKey, animationTiming, onComplete }: ChecklistAnimatorProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      setActiveIndex(null);
      setCompleted([]);

      for (let i = 0; i < items.length; i += 1) {
        if (isCancelled) return;
        setActiveIndex(i);
        // await wait(500);

        const min = animationTiming?.minDelayMs ?? 400;
        const max = animationTiming?.maxDelayMs ?? 700;
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        await wait(delay);



        if (isCancelled) return;
        setCompleted((prev) => [...prev, i]);
      }

      if (!isCancelled) {
        setActiveIndex(null);
        onComplete?.();
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [items, playKey, onComplete]);

  return (
    <ul class="mt-10 space-y-4">
      {items.map((label, index) => {
        const isDone = completed.includes(index);
        const isCurrent = activeIndex === index;

        return (
          <li key={`${playKey}-${label}`} class="flex items-center gap-3 text-brand-blue">
            <span class="flex h-6 w-6 items-center justify-center">
              {isDone ? (
                <svg class="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3-3A1 1 0 016.8 9.793l2.293 2.293 6.493-6.493a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              ) : isCurrent ? (
                <span class="h-5 w-5 animate-spin rounded-full border-3 border-[#1264c1] border-r-transparent" />
              ) : (
                <span class="h-5 w-5 rounded-full border border-brand-blue/30" />
              )}
            </span>
            <span class={`text-sm font-semibold ${isDone ? 'text-emerald-600' : 'text-brand-blue'}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}