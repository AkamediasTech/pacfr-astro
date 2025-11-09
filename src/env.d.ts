/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.astro" {
    const Component: import("astro").AstroComponentFactory;
    export default Component;
}

declare module "*.svg?component" {
    import type { FunctionalComponent } from "preact";
    const Component: FunctionalComponent<any>;
    export default Component;
}

declare module "*.avif" {
    const metadata: import("astro").ImageMetadata;
    export default metadata;
}

declare module "*.png" {
    const metadata: import("astro").ImageMetadata;
    export default metadata;
}

declare module "*.webp" {
    const metadata: import("astro").ImageMetadata;
    export default metadata;
}
