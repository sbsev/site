import rollupYaml from '@rollup/plugin-yaml'
import adapter from '@sveltejs/adapter-static'
import 'dotenv/config'
import path from 'path'
import preprocess from 'svelte-preprocess'
import Icons from 'unplugin-icons/vite'

const space_id = process.env.VITE_CONTENTFUL_SPACE_ID
const access_token = process.env.VITE_CONTENTFUL_ACCESS_TOKEN

const contentful_gql = `https://graphql.contentful.com/content/v1/spaces`

// eslint-disable-next-line no-console
console.log(
  `GraphiQL explorer:`,
  `${contentful_gql}${space_id}/explore?access_token=${access_token}`
)

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    prerender: { default: true },

    vite: {
      plugins: [rollupYaml(), Icons({ compiler: `svelte`, autoInstall: true })],

      ssr: {
        external: [`algoliasearch`],
      },

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
    },

    trailingSlash: `ignore`, // GitHub issue discussing Netlify: https://git.io/JngRL
  },
}
