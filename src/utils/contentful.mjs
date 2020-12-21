/* eslint-disable no-console */
import 'dotenv/config.js'

import contentful from 'contentful-management'

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env
const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces/`

export const gqlEndPoint = `${ctfGqlUrl}${CONTENTFUL_SPACE_ID}?access_token=${CONTENTFUL_ACCESS_TOKEN}`
export const graphiql = `${ctfGqlUrl}${CONTENTFUL_SPACE_ID}/explore?access_token=${CONTENTFUL_ACCESS_TOKEN}`

// to use any of the functions in this file, generate a Content Management Token (CMT) at
// https://app.contentful.com/spaces/gi9muc70s4ub/api/cma_tokens and add it to your .env file
const getClient = () =>
  contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

export async function searchPages(
  searchTerm = process.argv[2],
  contentType = `page`
) {
  const space = await getClient().getSpace(CONTENTFUL_SPACE_ID)

  const env = await space.getEnvironment(`master`)
  let { items } = await env.getEntries({ content_type: contentType })
  items = items.filter(
    (item) => item.fields.body && item.fields.body.de.includes(searchTerm)
  )
  items = items.map((item) => item.fields.title.de)
  console.log(`items of type ${contentType} containing ${searchTerm}:`, items)
}

// call node src/utils/contentful.js
// searchPages()
