import 'dotenv/config'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import { indexAlgolia } from 'svelte-algolia'
import svelteSVG from 'rollup-plugin-svelte-svg'

import pkg from './package.json'
import { algoliaConfig } from './src/utils/algolia'

const keys = [
  `NODE_ENV`,
  `CONTENTFUL_ACCESS_TOKEN`,
  `CONTENTFUL_SPACE_ID`,
  `AIRTABLE_CHAPTER_BASE_APP_ID`,
]

const replacements = replace({
  'process.browser': true,
  ...Object.fromEntries(
    keys.map((key) => [`process.env.${key}`, JSON.stringify(process.env[key])])
  ),
})
const dev = process.env.NODE_ENV === `development`

if (dev) {
  const ctfToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const ctfId = process.env.CONTENTFUL_SPACE_ID

  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces`
  const graphiql = `${ctfGqlUrl}/${ctfId}/explore?access_token=${ctfToken}`
  // eslint-disable-next-line no-console
  console.log(`Contentful GraphiQL:`, graphiql)
}

const onwarn = (warning, onwarn) =>
  (warning.code === `MISSING_EXPORT` && /'preload'/.test(warning.message)) ||
  (warning.code === `CIRCULAR_DEPENDENCY` &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replacements,
      svelteSVG({ dev }),
      svelte({
        compilerOptions: {
          dev,
          hydratable: true,
        },
        emitCss: true,
      }),
      resolve({
        browser: true,
        dedupe: [`svelte`],
      }),
      commonjs(),

      !dev && terser({ module: true }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replacements,
      svelteSVG({ generate: `ssr`, dev }),
      svelte({
        compilerOptions: {
          generate: `ssr`,
          dev,
          hydratable: true,
        },
      }),
      resolve({
        dedupe: [`svelte`],
      }),
      commonjs(),
      // don't try to indexAlgolia if no apiKey was specified (e.g. in GitHub CI)
      !dev && algoliaConfig.apiKey && indexAlgolia(algoliaConfig),
    ],

    external: Object.keys(pkg.dependencies).concat(
      require(`module`).builtinModules
    ),
    preserveEntrySignatures: `strict`,
    onwarn,
  },
}
