/* eslint-disable indent */
import yaml from 'js-yaml'
import marked from '../utils/marked'
import type { Chapter, Form, Page, Post } from './types'

const prefixSlug = (prefix: string) => (obj: Page | Post) => {
  obj.slug = prefix + obj.slug
  return obj
}

export async function airtableFetch(
  query: string,
  options = {}
): Promise<Record<string, unknown>> {
  const apiKey = import.meta.env.VITE_AIRTABLE_CHAPTER_BASE_APP_ID

  if (!apiKey) throw `Missing Airtable API key. Please add to .env file`

  const response = await fetch(
    `https://api.baseql.com/airtable/graphql/${apiKey}`,
    {
      method: `POST`,
      headers: { 'Content-Type': `application/json` },
      body: JSON.stringify({ query }),
      ...options,
    }
  )

  const { data, error } = await response.json()

  if (error) throw error
  return data
}

export async function contentfulFetch(query: string) {
  const token = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
  const id = import.meta.env.VITE_CONTENTFUL_SPACE_ID

  if (!token || !id) {
    throw `Missing Contentful access token and/or space ID. Please add to .env file`
  }

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
      acceptsSignups
      token
    }
  }
}`

export async function fetchChapters(): Promise<Chapter[]> {
  const { chapters } = await contentfulFetch(chaptersQuery)
  return chapters?.items?.map(prefixSlug(`/standorte/`))
}

export async function base64Thumbnail(
  url: string,
  options?: { type?: string; w?: number; h?: number }
): Promise<string> {
  const { type = `jpg`, w = 10, h = 10 } = options ?? {}

  const response = await fetch(`${url}?w=${w}&h=${h}&q=80`)

  if (typeof window === `undefined`) {
    // server side (node) https://stackoverflow.com/a/52467372
    const buffer = Buffer.from(await response.arrayBuffer())
    return `data:image/${type};base64,` + buffer.toString(`base64`)
  } else {
    // client side (browser) https://stackoverflow.com/a/20285053
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

function renderBody(itm: Page | Post) {
  if (!itm?.body) return itm

  itm.body = marked(itm.body) // generate HTML
  itm.plainBody = itm.body.replace(/<[^>]*>/g, ``) // strip HTML tags to get plain text

  return itm
}

const coverFragment = `
  cover {
    src: url
    alt: description
    title
    width
    height
  }
`

const pageFragment = `
  items {
    title
    slug
    body
    toc
    yaml
    ${coverFragment}
    sys {
      publishedAt
    }
  }
`

const pageQuery = (slug: string) => `{
  pages: pageCollection(where: {slug_in: ["${slug}", "/${slug}"]}) {
    ${pageFragment}
  }
}`

const pagesQuery = `{
  pages: pageCollection {
    ${pageFragment}
  }
}`

export async function fetchPage(slug: string): Promise<Page | null> {
  if (!slug) throw `fetchPage requires a slug, got '${slug}'`

  if (slug.endsWith(`/`) && slug !== `/`) slug = slug.slice(0, -1)

  const data = await contentfulFetch(pageQuery(slug))
  const page = data?.pages?.items[0]
  if (!page) return null

  if (page?.yaml) {
    page.yaml = yaml.load(page.yaml)
    Object.entries(page.yaml).forEach(([key, val]) => {
      if (typeof val === `string`) page.yaml[key] = marked.parseInline(val)
    })
  }

  page.cover.base64 = await base64Thumbnail(page.cover.src)

  return renderBody(page)
}

export async function fetchPages(): Promise<Page[]> {
  const data = await contentfulFetch(pagesQuery)
  return data?.pages?.items?.map(renderBody)
}

const postFragment = `
  items {
    title
    slug
    date
    body
    ${coverFragment}
    tags
    author {
      name
      email
      url
      bio
      fieldOfStudy
      photo {
        src: url
        width
        height
      }
    }
  }
`

const postQuery = (slug: string) => `{
  posts: postCollection(order: date_DESC, where: {slug_in: ["${slug}", "/${slug}"]}) {
    ${postFragment}
  }
}`

const postsQuery = `{
  posts: postCollection(order: date_DESC) {
    ${postFragment}
  }
}`

async function processPost(post: Post) {
  if (!post) return
  renderBody(post)
  prefixSlug(`/blog/`)(post)
  post.author.photo.base64 = await base64Thumbnail(post.author.photo.src, {
    w: 3,
    h: 3,
  })
  post.cover.base64 = await base64Thumbnail(post.cover.src)
  return post
}

export async function fetchPost(slug: string): Promise<Post> {
  if (!slug) throw `fetchPost requires a slug, got '${slug}'`
  const data = await contentfulFetch(postQuery(slug))
  const post = data?.posts?.items[0]
  await processPost(post)
  return post
}

export async function fetchPosts(): Promise<Post[]> {
  const data = await contentfulFetch(postsQuery)
  const posts = data?.posts?.items
  return await Promise.all(posts.map(processPost))
}

const yamlQuery = (title: string) => `{
  yml: yamlCollection(where: {title: "${title}"}) {
    items {
      data
    }
  }
}`

export async function fetchYaml(title: string) {
  if (!title) throw `fetchYaml requires a title, got '${title}'`
  const { yml } = await contentfulFetch(yamlQuery(title))
  return yaml.load(yml?.items[0]?.data)
}

function titleToSlug(itm: Record<string, unknown> & { title: string }) {
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

export async function fetchYamlList(
  title: string,
  slugPrefix: string
): Promise<Record<string, unknown>[]> {
  const list = await fetchYaml(title)
  return list.map(renderBody).map(titleToSlug).map(prefixSlug(slugPrefix))
}

// remove outer-most paragraph tags (if any)
const stripOuterParTag = (str: string) =>
  str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

export function parseFormData(obj: Form): Form {
  const renderer = new marked.Renderer()
  // open links in new tabs so form is not closed (https://git.io/J3p5G)
  renderer.link = (href: string, _: string, text: string) =>
    `<a target="_blank" href="${href}">${text}</a>`
  marked.use({ renderer })

  for (const [key, itm] of Object.entries(obj)) {
    if ([`title`, `note`].includes(key)) {
      // strip lines of leading white space to prevent turning indented markdown into <pre> code blocks
      // https://github.com/markedjs/marked/issues/1696
      const markdown = itm.replace(/^[^\S\r\n]+/gm, ``) // match all white space at line starts except newlines
      obj[key] = stripOuterParTag(marked(markdown))
    } else if (typeof itm === `object` && itm !== null) parseFormData(itm)
  }
  return obj
}
