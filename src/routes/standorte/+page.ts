import { fetchChapters, fetchPage } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
  const page = await fetchPage(
    url.pathname.split(`/`).filter(Boolean).join(`/`)
  )
  const chapters = await fetchChapters()

  return { page, chapters }
}
