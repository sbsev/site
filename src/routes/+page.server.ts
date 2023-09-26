import { fetch_chapters, fetch_page } from '$lib/fetch'

export const load = async () => {
  return {
    page: fetch_page(`/`),
    chapters: fetch_chapters(),
  }
}
