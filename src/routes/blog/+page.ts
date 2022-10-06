import { fetchPosts, fetchYaml } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return { posts: fetchPosts(), social: fetchYaml(`Social`) }
}
