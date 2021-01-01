import 'dotenv/config.js'
import fs from 'fs'
import yaml from 'js-yaml'

const { CONTENTFUL_ACCESS_TOKEN: token, CONTENTFUL_SPACE_ID: id } = process.env
const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces`

export const gqlEndPoint = `${ctfGqlUrl}/${id}?access_token=${token}`
export const graphiql = `${ctfGqlUrl}/${id}/explore?access_token=${token}`

import contentful from 'contentful-management'

// to use any of the functions in this file, generate a Content Management Token (CMT) at
// https://app.contentful.com/spaces/gi9muc70s4ub/api/cma_tokens and add it to your .env file
const getClient = () =>
  contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

export async function searchStringInContentType(
  searchTerm = process.argv[2],
  contentType = process.argv[3] || `page`
) {
  const space = await getClient().getSpace(id)

  const env = await space.getEnvironment(`master`)
  let { items } = await env.getEntries({ content_type: contentType })
  items = items.filter(
    (item) => item.fields.body && item.fields.body.de.includes(searchTerm)
  )
  items = items.map((item) => item.fields.title.de)
  // eslint-disable-next-line no-console
  console.log(`items of type ${contentType} containing ${searchTerm}:`, items)
}

export async function createFAQEntries() {
  const data = fs.readFileSync(`./faq.yml`)
  const faqs = yaml.safeLoad(data)

  const space = await getClient().getSpace(id)

  const env = await space.getEnvironment(`master`)

  faqs.forEach(async ({ title, body, tags }) => {
    await env.createEntry(`faq`, {
      fields: {
        title: { de: title },
        tags: { de: tags },
        body: { de: body },
      },
    })
  })
}

// run with: node src/utils/contentful.js
// try {
//   createFAQEntries()
// } catch (error) {
//   console.error(error)
// }
