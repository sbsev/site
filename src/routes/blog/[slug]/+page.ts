import { fetchPost } from '$lib/fetch'
import type { PageLoad } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params }) => {
  const post = await fetchPost(params.slug)

  if (!post) throw error(404)

  return { post }
}
