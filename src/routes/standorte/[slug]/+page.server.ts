import { fetch_page, fetch_chapters } from '$lib/fetch'
import { error } from '@sveltejs/kit'
import type { ChapterStatus } from '$lib/types'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { slug } = params

  const page = await fetch_page(`standorte/${slug}`, fetch)

  if (!page) throw error(404)

  // Fetch chapter data to get the status
  const chapters = await fetch_chapters(fetch)
  const chapter = chapters.find((c) => c.slug === `/standorte/${slug}`)
  const chapterStatus: ChapterStatus = chapter?.status ?? 'active'

  return { page, slug, chapterStatus }
}
