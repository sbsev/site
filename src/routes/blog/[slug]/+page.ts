import { fetch_posts } from '$lib/fetch'

export async function entries() {
  try {
    const posts = await fetch_posts()
    return posts.map((post) => ({ slug: post.slug.replace(`/blog/`, ``) }))
  } catch (error) {
    console.debug(`Failed to fetch posts for prerendering:`, error)
    return []
  }
}

export const prerender = true
