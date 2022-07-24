import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'
import Icons from 'unplugin-icons/vite'

export default {
  plugins: [
    sveltekit(),
    rollupYaml(),
    Icons({ compiler: `svelte`, autoInstall: true }),
  ],

  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },

  resolve: {
    alias: {
      $src: path.resolve(`./src`),
    },
  },

  test: {
    testTimeout: 60_000,
  },
}
