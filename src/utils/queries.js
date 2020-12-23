import 'cross-fetch/polyfill'

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
  chapters: chapterCollection(where: { active: true }) {
    items {
      title
      slug
      coords {
        lat
        lng: lon
      }
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
        url
        width
        height
      }
      sys {
        publishedAt
      }
    }
  }
}`

export async function fetchPage(slug, uri) {
  const data = await gqlFetch(uri, pageQuery(slug))
  return data?.pages?.items[0]
}

export async function fetchPages(uri) {
  const data = await gqlFetch(uri, pageQuery())
  return data?.pages?.items
}

const postQuery = (slug) => `{
  posts: contentType2WKn6YEnZewu2ScCkus4AsCollection
  ${slug ? `(where: {slug: "${slug}"})` : ``} {
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

export async function fetchPost(slug, uri) {
  const data = await gqlFetch(uri, postQuery(slug))
  const post = data?.posts?.items[0]
  post.tags = post.tags.items.map((tag) => tag.title)
  return prefixSlug(post, `blog/`)
}

export async function fetchPosts(uri) {
  const data = await gqlFetch(uri, postQuery())
  const posts = data?.posts?.items
  return posts.map((post) => {
    post.tags = post.tags.items.map((tag) => tag.title)
    return prefixSlug(post, `blog/`)
  })
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
