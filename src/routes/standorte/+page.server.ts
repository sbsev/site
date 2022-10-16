import { fetch_chapters, fetch_page } from '$lib/fetch'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
  return {
    page: fetch_page(url.pathname.split(`/`).filter(Boolean).join(`/`)),
    chapters: fetch_chapters(),
  }
}
