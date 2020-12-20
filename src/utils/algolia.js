import 'dotenv/config'

import { fetchPages, fetchPosts } from './queries'
import { mdToPlain } from './mdToPlain'

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env
const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces/`
const gqlEndPoint = `${ctfGqlUrl}${CONTENTFUL_SPACE_ID}?access_token=${CONTENTFUL_ACCESS_TOKEN}`

const bodyToPlainText = (fetchFunction) => async () => {
  const items = await fetchFunction(gqlEndPoint)
  items.forEach((itm) => {
    if (itm.body) {
      itm.excerpt = mdToPlain(itm.body)
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
  settings: { attributesToSnippet: [`excerpt:20`, `body:20`] },
}
