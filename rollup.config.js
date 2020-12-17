import 'dotenv/config'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
import rollupYaml from '@rollup/plugin-yaml'
import { mdsvex } from 'mdsvex'
import { indexAlgolia } from 'svelte-algolia'
import marked from 'marked'
import { mdToPlain } from './src/utils/mdToPlain'
import svelteSVG from 'rollup-plugin-svelte-svg'

// YAML transformer   nn  used by @rollup/plugin-yaml
function yamlTransform(data, id) {
  // the content in these files needs further processing
  const files = [`films`, `articles`, `press`]
  // check if YAML file is one that needs processing
  if (files.some((str) => id.includes(str))) {
    const slugPrefix = files.find((type) => id.includes(type))

    data.forEach((itm) => {
      if (itm.date) itm.date = new Date(itm.date).toLocaleDateString(`de`)
      if (itm.md) {
        // convert markdown to plain text and truncate at after 15 words
        itm.excerpt =
          mdToPlain(itm.md).split(` `).splice(0, 15).join(` `) + `&hellip;`
        itm.html = marked(itm.md)
      }
      if (itm.slug) {
        itm.objectID = itm.slug
        itm.slug = `/${slugPrefix}/${itm.slug}`
      }
    })

    return data
  }
}

const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const gqlEndpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}/explore?access_token=${accessToken}`

// eslint-disable-next-line no-console
console.log(`GraphiQL:`, gqlEndpoint)

const replacements = replace({
  'process.browser': true,
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
})
const dev = process.env.NODE_ENV === `development`

const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_KEY,
  partialUpdates: true,
  indices: [
    { name: `posts`, getData: [{ foo: `bar` }] },
    { name: `pages`, getData: [{ foo: `bar` }] },
  ],
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
      rollupYaml({ transform: yamlTransform }),
      replacements,
      svelteSVG({ dev }),
      svelte({
        compilerOptions: {
          dev,
          hydratable: true,
        },
        emitCss: true,
        preprocess: mdsvex(),
        extensions: [`.svelte`, `.svx`],
      }),
      resolve({
        browser: true,
        dedupe: [`svelte`],
      }),
      commonjs(),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      rollupYaml({ transform: yamlTransform }),
      replacements,
      svelteSVG({ generate: `ssr`, dev }),
      svelte({
        compilerOptions: {
          generate: `ssr`,
          dev,
          hydratable: true,
        },
        preprocess: mdsvex(),
        extensions: [`.svelte`, `.svx`],
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
