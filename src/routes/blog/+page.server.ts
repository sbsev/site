import { fetch_posts, fetch_yaml } from '$lib/fetch'

export const load = async () => {
  return { posts: await fetch_posts(), social: await fetch_yaml(`Social`) }
}
