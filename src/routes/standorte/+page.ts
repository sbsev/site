import { fetchChapters, fetchPage } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
  return {
    page: fetchPage(url.pathname.split(`/`).filter(Boolean).join(`/`)),
    chapters: fetchChapters(),
  }
}
