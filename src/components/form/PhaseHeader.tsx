import type { FunctionalComponent } from 'preact';
import { DEFAULT_HEADER_STEP } from './config';
import type { PhaseHeaderContent } from './config';

type PhaseHeaderProps = {
  content?: PhaseHeaderContent;
};

const PhaseHeader: FunctionalComponent<PhaseHeaderProps> = ({ content }) => {
  const fallback = DEFAULT_HEADER_STEP;
  const header = content ?? fallback;

  const backgroundClass = header.backgroundClass ?? fallback.backgroundClass ?? 'bg-brand-blue';
  const title = header.title ?? fallback.title;
  const subtitle = header.subtitle ?? fallback.subtitle ?? '';
  const hasSubtitle = Boolean(subtitle);

  return (
    <header class={`${backgroundClass} px-6 pb-6 pt-6 text-center text-white sm:px-8 transition-colors duration-500`}>
      <h1 class="text-xl font-semibold sm:text-2xl">{title}</h1>
      <p
        class={`mt-1 text-xs uppercase tracking-[0.4em] text-white/70 transition-opacity duration-300 ${
          hasSubtitle ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hasSubtitle ? subtitle : '\u2007'}
      </p>
    </header>
  );
};

export default PhaseHeader;