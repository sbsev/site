import { fetchPost } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const post = await fetchPost(params.slug)

  if (!post) throw error(404)

  return { post }
}
