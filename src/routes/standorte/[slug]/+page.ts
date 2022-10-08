import { fetchPage } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const { slug } = params

  const page = await fetchPage(`standorte/${slug}`)

  if (!page) throw error(404)

  return { page, slug }
}
