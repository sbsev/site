import { fetch_posts, fetch_yaml } from '$lib/fetch'

export const load = () => {
  return { posts: fetch_posts(), social: fetch_yaml(`Social`) }
}
