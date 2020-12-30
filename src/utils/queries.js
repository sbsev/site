import 'cross-fetch/polyfill'
import marked from 'marked'

function prefixSlug(obj, prefix) {
  obj.slug = prefix + obj.slug
  return obj
}

export const gqlFetch = async (uri, query) => {
  const response = await fetch(uri, {
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

export async function fetchChapters(uri) {
  const { chapters } = await gqlFetch(uri, chaptersQuery)
  return chapters?.items?.map((chapter) => prefixSlug(chapter, `standorte/`))
}

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
        description
        url(transform: {format: WEBP})
        width
        height
      }
      sys {
        publishedAt
      }
    }
  }
}`

function processPage(page) {
  if (!page?.body) return page

  page.body = marked(page.body) // generate HTML
  page.plainBody = page.body.replace(/<[^>]*>/g, ``) // strip HTML tags to get plain text

  return page
}

export async function fetchPage(slug, uri) {
  const data = await gqlFetch(uri, pageQuery(slug))
  const page = data?.pages?.items[0]
  return processPage(page)
}

export async function fetchPages(uri) {
  const data = await gqlFetch(uri, pageQuery())
  return data?.pages?.items?.map(processPage)
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
        description
        url
        width
        height
      }
      tags: tagsCollection {
        items {
          title
        }
      }
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
  post.tags = post.tags.items.map((tag) => tag.title)
  processPage(post)
  prefixSlug(post, `blog/`)
  return post
}

export async function fetchPost(slug, uri) {
  const data = await gqlFetch(uri, postQuery(slug))
  const post = data?.posts?.items[0]
  return processPost(post)
}

export async function fetchPosts(uri) {
  const data = await gqlFetch(uri, postQuery())
  const posts = data?.posts?.items
  return posts.map(processPost)
}

const jsonQuery = (title) => `{
  json: jsonCollection(where: {title: "${title}"}) {
    items {
      data
    }
  }
}`

export async function fetchJson(title, uri) {
  const data = await gqlFetch(uri, jsonQuery(title))
  return data?.json?.items[0]?.data
}

const tagsQuery = `{
  tags: blogTagCollection(order: title_ASC) {
    items {
      title
      linkedFrom {
        entryCollection {
          total
        }
      }
      icon {
        url
      }
    }
  }
}`

function processTag(tag) {
  const { total } = tag?.linkedFrom?.entryCollection
  tag.total = total
  delete tag?.linkedFrom
  return tag
}

export async function fetchTags(uri) {
  const { tags } = await gqlFetch(uri, tagsQuery)
  return tags?.items.map(processTag)
}

const microcopyQuery = (title) => `{
  microcopy: microcopyCollection${title ? `(where: {title: "${title}"})` : ``} {
    items {
      text
    }
  }
}`

export async function fetchMicrocopy(title, uri) {
  const { microcopy } = await gqlFetch(uri, microcopyQuery(title))
  return microcopy?.items[0]?.text
}
