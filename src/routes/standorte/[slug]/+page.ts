import { fetchPage } from '$src/fetch'
import type { PageLoad } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params }) => {
  const { slug } = params

  const page = await fetchPage(`standorte/${slug}`)

  if (!page) throw error(404)

  return { page, slug }
}
