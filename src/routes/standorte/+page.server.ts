import { fetch_chapters, fetch_page } from '$lib/fetch'

export const load = async ({ url }) => {
  return {
    page: fetch_page(url.pathname.split(`/`).filter(Boolean).join(`/`)),
    chapters: fetch_chapters(),
  }
}
