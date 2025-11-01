// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://lemonchiffon-jaguar-901965.hostingersite.com/astro-test/dist/',
  base: '/astro-test/dist/',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [preact()]
});