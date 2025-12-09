import { fetch_posts, fetch_yaml } from '$lib/fetch'

export const load = async ({ fetch }) => {
  return {
    posts: await fetch_posts(fetch),
    social: await fetch_yaml(`Social`, fetch),
  }
}
