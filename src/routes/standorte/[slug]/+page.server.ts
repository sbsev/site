import { fetch_page } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params

  const page = await fetch_page(`standorte/${slug}`)

  if (!page) throw error(404)

  return { page, slug }
}
