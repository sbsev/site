import { fetch_page } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import { fetch_chapters } from '$lib/fetch'

export const load = async ({ params }) => {
  const { slug } = params

  const page = await fetch_page(`standorte/${slug}`)

  const chapters = await fetch_chapters()

  const selectedChapter = chapters.find((ch) => ch.slug == `/standorte/${slug}`)

  if (!page) throw error(404)

  return { page, slug, selectedChapter }
}
