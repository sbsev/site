import { fetch_post } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const post = await fetch_post(params.slug)

  if (!post) throw error(404)

  return { post }
}
