import { fetch_chapters, fetch_page } from '$lib/fetch'

export const load = async ({ url, fetch }) => {
  return {
    page: await fetch_page(
      url.pathname.split(`/`).filter(Boolean).join(`/`),
      fetch,
    ),
    chapters: await fetch_chapters(fetch),
  }
}
