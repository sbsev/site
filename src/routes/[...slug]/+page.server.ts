import { fetch_page } from '$lib/fetch'
import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {

  const page = await fetch_page(params.slug)

  // If no page data could be fetched for params.slug, the page doesn't exist,
  // so we fall through to src/routes/__error.svelte.
  if (!page) throw error(404)

  return { page }
}
