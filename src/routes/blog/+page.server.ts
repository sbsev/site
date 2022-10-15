import { fetch_posts, fetch_yaml } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return { posts: fetch_posts(), social: fetch_yaml(`Social`) }
}
