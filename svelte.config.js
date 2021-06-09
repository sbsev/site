import 'dotenv/config'
import replace from '@rollup/plugin-replace'
import adapter from '@sveltejs/adapter-netlify'

import { indexAlgolia } from 'svelte-algolia'
import { algoliaConfig } from './src/utils/algolia.js'

const dev = process.env.NODE_ENV === `development`
if (dev) {
  const ctfToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const ctfId = process.env.CONTENTFUL_SPACE_ID

  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces`
  const graphiql = `${ctfGqlUrl}/${ctfId}/explore?access_token=${ctfToken}`
  // eslint-disable-next-line no-console
  console.log(`Contentful GraphiQL:`, graphiql)
} else {
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
  kit: {
    adapter: adapter(),

    // hydrate the div with id 'svelte' in src/app.html
    target: `#svelte`,

    vite: {
      plugins: [replace(replacements)],
    },
  },
}
