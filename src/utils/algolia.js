import { fetchPages, fetchPosts } from './queries'
import { mdToPlain } from './mdToPlain'

import { gqlEndPoint } from './contentful'

const bodyToPlainText = (fetchFunction) => async () => {
  const items = await fetchFunction(gqlEndPoint)
  items.forEach((itm) => {
    if (itm.body) {
      itm.body = mdToPlain(itm.body).slice(0, 5000)
    }
    itm.id = itm.slug
  })
  return items
}

export const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_KEY,
  // partialUpdates: true,
  indices: [
    { name: `Pages`, getData: bodyToPlainText(fetchPages) },
    { name: `Posts`, getData: bodyToPlainText(fetchPosts) },
  ],
  settings: { attributesToSnippet: [`body:20`] },
}
