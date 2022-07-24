import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import Icons from 'unplugin-icons/vite'

export default {
  plugins: [
    sveltekit(),
    rollupYaml(),
    Icons({ compiler: `svelte`, autoInstall: true }),
  ],

  server: {
    port: 3000,
  },

  resolve: {
    alias: {
      $src: resolve(`./src`),
    },
  },

  test: {
    testTimeout: 60_000,
  },
}
