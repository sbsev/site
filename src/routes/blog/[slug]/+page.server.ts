import { fetch_post } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const post = await fetch_post(params.slug)

  if (!post) throw error(404)

  return { post }
}
