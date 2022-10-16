import { fetch_posts, fetch_yaml } from '$lib/fetch'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return { posts: fetch_posts(), social: fetch_yaml(`Social`) }
}
