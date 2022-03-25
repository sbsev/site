import type { RequestHandler } from '@sveltejs/kit'
import { fetchPosts, fetchYaml } from '../../fetch'

export const get: RequestHandler = async () => {
  const posts = await fetchPosts()
  const social = await fetchYaml(`Social`)

  if (posts && social) return { body: { posts, social } }
  else return { status: 404 }
}
