import { fetch_chapters, fetch_page } from '$lib/fetch'

export const load = async ({ url }) => {
  return {
    page: await fetch_page(url.pathname.split(`/`).filter(Boolean).join(`/`)),
    chapters: await fetch_chapters(),
  }
}
