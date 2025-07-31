import { fetch_chapters, fetch_page } from '$lib/fetch'

export const load = async () => {
  const page = await fetch_page(`/`)
  const chapters = await fetch_chapters()

  return {
    page,
    chapters,
  }
}
