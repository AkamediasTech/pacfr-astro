// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
    site: "https://lemonchiffon-jaguar-901965.hostingersite.com/astro-test/dist/",
    base: "/astro-test/dist/",
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@": ".",
                "@layouts": "/src/layouts",
                "@content": "/src/content",
                "@components": "/src/components",
                "@sections": "/src/sections",
                "@themes": "/src/themes",
                "@utils": "/src/utils",
            },
        },
    },

    integrations: [preact()],
});
