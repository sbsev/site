import replace from '@rollup/plugin-replace'
import rollupYaml from '@rollup/plugin-yaml'
import adapter from '@sveltejs/adapter-static'
import 'dotenv/config'
import preprocess from 'svelte-preprocess'

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
  const { indexAlgolia } = await import(`svelte-algolia/server-side`)
  const { algoliaConfig } = await import(`./package/utils/algolia.js`)
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

    files: {
      lib: `src`,
    },

    package: {
      files: (path) =>
        [`fetch.ts`, `utils/marked.ts`, `utils/algolia.ts`].includes(path),
    },

    vite: {
      plugins: [replace(replacements), rollupYaml()],
      build: {
        rollupOptions: {
          output: { manualChunks: undefined },
        },
      },
    },

    // https://kit.svelte.dev/docs#configuration-trailingslash
    trailingSlash: `ignore`, // GitHub issue discussing Netlify: https://git.io/JngRL
  },
}
