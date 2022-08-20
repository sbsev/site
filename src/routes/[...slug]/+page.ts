import { fetchPage } from '$lib/fetch'
import type { PageLoad } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params }) => {
  // delegate route to static/robots.txt
  // is this check necessary, will prob fallthrough anyway
  if (params.slug === `robots.txt`) throw error(404)

  const page = await fetchPage(params.slug)

  // If no page data could be fetched for params.slug, the page doesn't exist,
  // so we fall through to src/routes/__error.svelte.
  if (!page) throw error(404)

  return { page }
}
