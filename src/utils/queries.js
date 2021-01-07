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
  const response = await fetch(process.env.gqlEndPoint, {
    method: `POST`,
    headers: { 'Content-Type': `application/json` },
    body: JSON.stringify({ query }),
  })
  const { data, error } = await response.json()
  if (error) console.error(error)
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
  small: url(transform: {format: WEBP, quality: 80, width: 400, height: 300, resizeStrategy: FILL})
  medium: url(transform: {format: WEBP, quality: 80, width: 800, height: 350, resizeStrategy: FILL})
  large: url(transform: {format: WEBP, quality: 80, width: 1200, height: 400, resizeStrategy: FILL})
  xl: url(transform: {format: WEBP, quality: 80, width: 1600, height: 500, resizeStrategy: FILL})
  jpg: url(transform: {quality: 80, width: 1200})
  url
  description
  title
  width
  height
`

const pageQuery = (slug) => `{
  pages: pageCollection
  ${slug ? `(where: {slug: "${slug}"})` : ``} {
    items {
      title
      subtitle
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

function renderBody(itm) {
  if (!itm?.body) return itm

  itm.body = marked(itm.body) // generate HTML
  itm.plainBody = itm.body.replace(/<[^>]*>/g, ``) // strip HTML tags to get plain text

  return itm
}

export async function fetchPage(slug) {
  const data = await gqlFetch(pageQuery(slug))
  const page = data?.pages?.items[0]
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
  const data = await gqlFetch(postQuery(slug))
  const post = data?.posts?.items[0]
  return processPost(post)
}

export async function fetchPosts() {
  const data = await gqlFetch(postQuery())
  const posts = data?.posts?.items
  return posts.map(processPost)
}

const yamlQuery = (title) => `{
  yml: yamlCollection${title ? `(where: {title: "${title}"})` : ``} {
    items {
      data
    }
  }
}`

export async function fetchYaml(title) {
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
