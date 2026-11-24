import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [
    sveltekit(),
    yaml(),
    Icons({
      compiler: 'svelte',
      // Match @iconify/svelte default sizing (1em = text size)
      scale: 1,
    }),
  ],

  server: {
    port: 3000,
    fs: {
      allow: [`..`],
    },
  },

  preview: {
    port: 3000,
  },

  fmt: {
    svelte: true,
    ignorePatterns: [`src/signup-form/**`],
  },

  lint: {
    ignorePatterns: [`**/*.svelte`, `build/**`, `.svelte-kit/**`, `scripts/**`],
    rules: {
      'no-unused-vars': [`error`, { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` }],
    },
  },
})
