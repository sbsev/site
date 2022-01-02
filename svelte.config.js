import replace from '@rollup/plugin-replace'
import adapter from '@sveltejs/adapter-static'
import 'dotenv/config'
import preprocess from 'svelte-preprocess'
import { algoliaConfig } from './src/utils/algolia.js'

const { NODE_ENV } = process.env

if (NODE_ENV === `development`) {
  const ctfToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const ctfId = process.env.CONTENTFUL_SPACE_ID

  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces`
  const graphiql = `${ctfGqlUrl}/${ctfId}/explore?access_token=${ctfToken}`
  // eslint-disable-next-line no-console
  console.log(`Contentful GraphiQL:`, graphiql)
} else if (NODE_ENV === `production`) {
  // update Algolia search indices on production builds
  const { indexAlgolia } = await import(`svelte-algolia/main.js`)
  indexAlgolia(algoliaConfig)
}

const keys = [
  `CONTENTFUL_ACCESS_TOKEN`,
  `CONTENTFUL_SPACE_ID`,
  `AIRTABLE_CHAPTER_BASE_APP_ID`,
]
const replacements = Object.fromEntries(
  keys.map((key) => [`process.env.${key}`, JSON.stringify(process.env[key])])
)

export default {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    // hydrate the div with id 'svelte' in src/app.html
    target: `#svelte`,

    vite: {
      plugins: [replace(replacements)],
    },

    // https://kit.svelte.dev/docs#configuration-trailingslash
    trailingSlash: `ignore`, // GitHub issue discussing Netlify: https://git.io/JngRL
  },
}
