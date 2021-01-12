/* eslint-disable indent */
import 'cross-fetch/polyfill'
import marked from 'marked'
import yaml from 'js-yaml'

const renderer = {
  image(href, title, text) {
    if (href?.includes(`images.ctfassets.net`) && !href.endsWith(`.svg`)) {
      title = title ? `title="${title}"` : ``
      return `
      <picture>
        <source media="(min-width: 1000px)" type="image/webp" srcset="${href}?w=1000&q=80&fm=webp" />
        <source media="(min-width: 800px)" type="image/webp" srcset="${href}?w=800&q=80&fm=webp" />
        <source media="(min-width: 600px)" type="image/webp" srcset="${href}?w=600&q=80&fm=webp" />
        <source media="(min-width: 400px)" type="image/webp" srcset="${href}?w=400&q=80&fm=webp" />
        <img src="${href}?w=1000&q=80" alt="${text}" ${title} loading="lazy" />
      </picture>`
    }

    return false // delegate to default marked image renderer
  },
}

marked.use({ renderer })

const prefixSlug = (prefix) => (obj) => {
  obj.slug = prefix + obj.slug
  return obj
}

export const gqlFetch = async (query) => {
  const token = process.env.CONTENTFUL_ACCESS_TOKEN
  const id = process.env.CONTENTFUL_SPACE_ID

  if (!token || !id)
    throw `missing Contentful access token and/or space ID. please add it to .env`

  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces`
  const ctfGraphqlEndPoint = `${ctfGqlUrl}/${id}?access_token=${token}`

  const response = await fetch(ctfGraphqlEndPoint, {
    method: `POST`,
    headers: { 'Content-Type': `application/json` },
    body: JSON.stringify({ query }),
  })

  const { data, error } = await response.json()

  if (error) throw error
  return data
}

const chaptersQuery = `{
  chapters: chapterCollection(where: { showInNav: true }, order: title_ASC) {
    items {
      title
      slug
      coords {
        lat
        lng: lon
      }
      baseId
      acceptsSignUps
    }
  }
}`

export async function fetchChapters() {
  const { chapters } = await gqlFetch(chaptersQuery)
  return chapters?.items?.map(prefixSlug(`standorte/`))
}

const coverFragment = `
  src: url
  alt: description
  title
  width
  height
`

const pageQuery = (slug) => `{
  pages: pageCollection
  ${slug ? `(where: {slug: "${slug}"})` : ``} {
    items {
      title
      slug
      body
      toc
      caption
      cover {
        ${coverFragment}
      }
      sys {
        publishedAt
      }
    }
  }
}`

export async function base64Thumbnail(url, type = `jpg`) {
  const response = await fetch(`${url}?w=15&h=5&q=80`)
  try {
    // server side (node) https://stackoverflow.com/a/52467372
    const buffer = await response.buffer()
    return `data:image/${type};base64,` + buffer.toString(`base64`)
  } catch (err) {
    // client side (browser) https://stackoverflow.com/a/20285053
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

function renderBody(itm) {
  if (!itm?.body) return itm

  itm.body = marked(itm.body) // generate HTML
  itm.plainBody = itm.body.replace(/<[^>]*>/g, ``) // strip HTML tags to get plain text

  return itm
}

export async function fetchPage(slug) {
  if (!slug) throw `fetchPage requires a slug, got '${slug}'`
  const data = await gqlFetch(pageQuery(slug))
  const page = data?.pages?.items[0]
  if (page?.cover?.src)
    page.cover.base64 = await base64Thumbnail(page?.cover?.src)
  return renderBody(page)
}

export async function fetchPages() {
  const data = await gqlFetch(pageQuery())
  return data?.pages?.items?.map(renderBody)
}

const postQuery = (slug) => `{
  posts: postCollection(order: date_DESC, ${
    slug ? `where: {slug: "${slug}"}` : ``
  }) {
    items {
      title
      slug
      date
      body
      cover {
        ${coverFragment}
      }
      tags
      author {
        name
        email
        url
        bio
        fieldOfStudy
        photo {
          title
          description
          url
        }
      }
    }
  }
}`

function processPost(post) {
  renderBody(post)
  prefixSlug(`blog/`)(post)
  return post
}

export async function fetchPost(slug) {
  if (!slug) throw `fetchPost requires a slug, got '${slug}'`
  const data = await gqlFetch(postQuery(slug))
  const post = data?.posts?.items[0]
  if (post?.cover?.src)
    post.cover.base64 = await base64Thumbnail(post?.cover?.src)
  return processPost(post)
}

export async function fetchPosts() {
  const data = await gqlFetch(postQuery())
  const posts = data?.posts?.items
  return posts.map(processPost)
}

const yamlQuery = (title) => `{
  yml: yamlCollection(where: {title: "${title}"}) {
    items {
      data
    }
  }
}`

export async function fetchYaml(title) {
  if (!title) throw `fetchYaml requires a title, got '${title}'`
  const { yml } = await gqlFetch(yamlQuery(title))
  return yaml.load(yml?.items[0]?.data)
}

function titleToSlug(itm) {
  itm.slug = itm.title
    .toLowerCase()
    .replace(/ä/g, `ae`)
    .replace(/ö/g, `oe`)
    .replace(/ü/g, `ue`)
    .replace(/[^\w ]+/g, ``)
    .replace(/[^\w ]+/g, ``)
    .replace(/ +/g, `-`)
  itm.id = itm.slug
  return itm
}

export async function fetchFaqs() {
  const faqs = await fetchYaml(`FAQ`)
  return faqs.map(renderBody).map(titleToSlug).map(prefixSlug(`faq#`))
}
