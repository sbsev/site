import 'dotenv/config'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import { indexAlgolia } from 'svelte-algolia'
import svelteSVG from 'rollup-plugin-svelte-svg'
import svelteImage from 'svelte-image'

import pkg from './package.json'
import { algoliaConfig } from './src/utils/algolia'
import { graphiql } from './src/utils/contentful'

const replacements = replace({
  'process.browser': true,
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
})
const dev = process.env.NODE_ENV === `development`

if (dev)
  // eslint-disable-next-line no-console
  console.log(`Contentful GraphiQL:`, graphiql)

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
        preprocess: [svelteImage()],
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
        preprocess: [svelteImage()],
      }),
      resolve({
        dedupe: [`svelte`],
      }),
      commonjs(),
      !dev && indexAlgolia(algoliaConfig),
    ],

    external: Object.keys(pkg.dependencies).concat(
      require(`module`).builtinModules
    ),
    preserveEntrySignatures: `strict`,
    onwarn,
  },
}
