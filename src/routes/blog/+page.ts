import { fetchPosts, fetchYaml } from '$src/fetch'
import type { PageLoad } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  const posts = await fetchPosts()
  const social = await fetchYaml(`Social`)

  return { posts, social }
}
