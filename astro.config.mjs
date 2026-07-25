// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import clerk from '@clerk/astro';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Canonical/OG URLs resolve against this. Set SITE_URL in Vercel for custom domains.
  site: process.env.SITE_URL || 'https://mixfai-hub.vercel.app',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), clerk()],
  adapter: vercel()
});
