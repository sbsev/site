import { fetch_pages, fetch_posts, fetch_yaml_list } from '$lib/fetch.js'

function processResults(
  fetchFunction:
    | typeof fetch_pages
    | typeof fetch_posts
    | typeof fetch_yaml_list,
  ...args: unknown[]
) {
  return async () => {
    const items = await fetchFunction(...args)

    for (const itm of items) {
      if (!itm.id) itm.id = itm?.slug || itm?.title
      // store plain body text as body in Algolia search index
      if (itm.body && itm.plainBody) {
        itm.body = itm.plainBody
        delete itm.plainBody
      }

      // ensure slugs start with a slash
      if (itm.slug && !itm.slug.startsWith(`/`)) {
        itm.slug = `/${itm.slug}`
      }
    }

    return items
  }
}

export const algoliaConfig = {
  appId: import.meta.env.VITE_ALGOLIA_APP_ID,
  apiKey: import.meta.env.VITE_ALGOLIA_ADMIN_KEY,
  // partialUpdates: true,
  indices: [
    { name: `Seiten`, getData: processResults(fetch_pages) },
    { name: `Posts`, getData: processResults(fetch_posts) },
    {
      name: `FAQs`,
      getData: processResults(fetch_yaml_list, `FAQ`, `faq#`),
    },
    {
      name: `Lernmaterial`,
      getData: processResults(fetch_yaml_list, `Lernmaterial`, `lernmaterial#`),
    },
  ],
  settings: {
    attributesToSnippet: [`body:20`],
    attributesToHighlight: [
      `title`,
      `date`,
      `body`,
      `cover.description`,
      `author.name`,
      `author.email`,
    ],
  },
}
