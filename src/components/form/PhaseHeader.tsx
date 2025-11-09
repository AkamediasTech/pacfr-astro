import type { FunctionalComponent } from "preact";
import { DEFAULT_HEADER_STEP } from "./config";
import type { PhaseHeaderContent } from "./config";

type PhaseHeaderProps = {
    content?: PhaseHeaderContent;
};

const PhaseHeader: FunctionalComponent<PhaseHeaderProps> = ({ content }) => {
    const fallback = DEFAULT_HEADER_STEP;
    const header = content ?? fallback;

    const backgroundClass =
        header.backgroundClass ?? fallback.backgroundClass ?? "bg-brand-blue";
    const title = header.title ?? fallback.title;
    const subtitle = header.subtitle ?? fallback.subtitle ?? "";
    const hasSubtitle = Boolean(subtitle);

    return (
        <header
            class={`${backgroundClass} px-2 pt-6 pb-6 text-center text-white transition-colors duration-500 sm:px-8`}
        >
            <h1 class="text-[17px] sm:text-xl">{title}</h1>
            <p
                class={`mt-1 text-xs tracking-[0.2em] text-white/90 uppercase transition-opacity duration-300 ${
                    hasSubtitle ? "opacity-100" : "opacity-0"
                }`}
            >
                {hasSubtitle ? subtitle : "\u2007"}
            </p>
        </header>
    );
};

export default PhaseHeader;
