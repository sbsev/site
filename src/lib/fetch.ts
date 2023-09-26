/* eslint-disable indent */
import { error as sveltekit_error } from '@sveltejs/kit'
import yaml from 'js-yaml'
import marked from '../utils/marked'
import type { Chapter, Form, Page, Post } from './types'

const prefixSlug = (prefix: string) => (obj: Page | Post) => {
  obj.slug = prefix + obj.slug
  return obj
}

export async function airtable_fetch(
  query: string,
  options = {},
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
    },
  )

  const { data, error } = await response.json()

  if (error) throw error
  return data
}

export async function contentful_fetch(query: string) {
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
  if (!data) throw sveltekit_error(404, `No data returned from Contentful`)
  return data
}

const chapters_query = `{
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
      status
      token
    }
  }
}`

export async function fetch_chapters(): Promise<Chapter[]> {
  const { chapters } = await contentful_fetch(chapters_query)
  return chapters?.items?.map(prefixSlug(`/standorte/`))
}

export async function base64_thumbnail(
  url: string,
  options?: { type?: string; w?: number; h?: number },
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

function parse_body(itm: Page | Post) {
  if (!itm?.body) return itm

  itm.body = marked(itm.body) // generate HTML
  itm.plainBody = itm.body.replace(/<[^>]*>/g, ``) // strip HTML tags to get plain text

  return itm
}

const cover_fragment = `
  cover {
    src: url
    alt: description
    title
    width
    height
  }
`

const page_fragment = `
  items {
    title
    slug
    body
    toc
    yaml
    ${cover_fragment}
    sys {
      publishedAt
    }
  }
`

const page_query = (slug: string) => `{
  pages: pageCollection(where: {slug_in: ["${slug}", "/${slug}"]}) {
    ${page_fragment}
  }
}`

export async function fetch_page(slug: string): Promise<Page | null> {
  if (!slug) throw `fetchPage requires a slug, got '${slug}'`

  if (slug.endsWith(`/`) && slug !== `/`) slug = slug.slice(0, -1)

  const data = await contentful_fetch(page_query(slug))
  const page = data?.pages?.items[0]
  if (!page) return null

  if (page?.yaml) {
    page.yaml = yaml.load(page.yaml)
    Object.entries(page.yaml).forEach(([key, val]) => {
      if (typeof val === `string`) page.yaml[key] = marked.parseInline(val)
    })
  }

  page.cover.base64 = await base64_thumbnail(page.cover.src)

  return parse_body(page)
}

export async function fetch_pages(): Promise<Page[]> {
  const data = await contentful_fetch(`{
    pages: pageCollection {
      ${page_fragment}
    }
  }`)
  return data?.pages?.items?.map(parse_body)
}

const post_fragment = `
  items {
    title
    slug
    date
    body
    ${cover_fragment}
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

const post_query = (slug: string) => `{
  posts: postCollection(order: date_DESC, where: {slug_in: ["${slug}", "/${slug}"]}) {
    ${post_fragment}
  }
}`

const posts_query = `{
  posts: postCollection(order: date_DESC) {
    ${post_fragment}
  }
}`

async function process_post(post: Post) {
  if (!post) return
  parse_body(post)
  prefixSlug(`/blog/`)(post)
  post.author.photo.base64 = await base64_thumbnail(post.author.photo.src, {
    w: 3,
    h: 3,
  })
  post.cover.base64 = await base64_thumbnail(post.cover.src)
  return post
}

export async function fetch_post(slug: string): Promise<Post> {
  if (!slug) throw `fetch_post() requires a slug, got '${slug}'`
  const data = await contentful_fetch(post_query(slug))
  const post = data?.posts?.items[0]
  await process_post(post)
  return post
}

export async function fetch_posts(): Promise<Post[]> {
  const data = await contentful_fetch(posts_query)
  const posts = data?.posts?.items
  return await Promise.all(posts.map(process_post))
}

const yaml_query = (title: string) => `{
  yml: yamlCollection(where: {title: "${title}"}) {
    items {
      data
    }
  }
}`

export async function fetch_yaml(title: string) {
  if (!title) throw `fetch_yaml() requires a title, got '${title}'`
  const { yml } = await contentful_fetch(yaml_query(title))
  return yaml.load(yml?.items[0]?.data)
}

function title_to_slug(itm: Record<string, unknown> & { title: string }) {
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

export async function fetch_yaml_list(
  title: string,
  slugPrefix: string,
): Promise<Record<string, unknown>[]> {
  const list = await fetch_yaml(title)
  return list.map(parse_body).map(title_to_slug).map(prefixSlug(slugPrefix))
}

// remove outer-most paragraph tags (if any)
const strip_outer_par_tag = (str: string) =>
  str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

export function parse_form_data(obj: Form): Form {
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
      obj[key] = strip_outer_par_tag(marked(markdown))
    } else if (typeof itm === `object` && itm !== null) parse_form_data(itm)
  }
  return obj
}
