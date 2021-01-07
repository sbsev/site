import 'dotenv/config.js'
import fs from 'fs'
import yaml from 'js-yaml'
import contentful from 'contentful-management'

const { CONTENTFUL_ACCESS_TOKEN: token, CONTENTFUL_SPACE_ID: id } = process.env
const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces`

export const gqlEndPoint = `${ctfGqlUrl}/${id}?access_token=${token}`
export const graphiql = `${ctfGqlUrl}/${id}/explore?access_token=${token}`

// to use any of the functions in this file, generate a Content Management Token (CMT) at
// https://app.contentful.com/spaces/gi9muc70s4ub/api/cma_tokens and add it to your .env file.
// Note that on any Contentful entry comes as an object with update/publish/archive/etc. methods
// as well as a fields and a sys key. Only the attributes in fields can be changed and then e.g.
// published(). The data in entry.sys can be consumed but is non-user editable. The API will throw
// if you modify sys and then try to publish()/update() an entry.
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
  items = items.filter((item) => item?.fields?.body?.de?.includes(searchTerm))
  items = items.map((item) => item.fields.title.de)
  // eslint-disable-next-line no-console
  console.log(`items of type ${contentType} containing ${searchTerm}:`, items)
}

export async function convertBlogTagsToStr() {
  const space = await getClient().getSpace(id)

  const env = await space.getEnvironment(`master`)
  let { items: tags } = await env.getEntries({ content_type: `blogTag` })
  let { items: posts } = await env.getEntries({ content_type: `post` })
  tags = Object.fromEntries(
    tags.map((tag) => [tag.sys.id, tag.fields.title.de])
  )
  posts.forEach((post) => {
    post.fields.tags2 = {}
    post.fields.tags2.de = post.fields.tags.de.map((tag) => tags[tag.sys.id])
    post.update()
    post.publish()
  })
}

export async function copyEntries() {
  // Microcopy to Yaml
  const space = await getClient().getSpace(id)

  const env = await space.getEnvironment(`master`)
  let { items } = await env.getEntries({ content_type: `microcopy` })
  items.forEach(async (itm) => {
    const entry = await env.createEntry(`yaml`, itm)
    await entry.publish()
  })
}

export async function createFAQEntries() {
  const faqs = yaml.load(fs.readFileSync(`./faq.yml`))

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
// searchStringInContentType()
