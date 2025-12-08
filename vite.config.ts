import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import type { UserConfig } from 'vite'

export default {
  plugins: [sveltekit(), yaml(), Icons({ compiler: 'svelte' })],

  server: {
    port: 3000,
    fs: {
      allow: [`..`],
    },
  },

  preview: {
    port: 3000,
  },
} satisfies UserConfig
