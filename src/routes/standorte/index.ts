import type { RequestHandler } from '@sveltejs/kit'
import { fetchChapters, fetchPage } from '../../fetch'

export const get: RequestHandler = async ({ url }) => {
  const page = await fetchPage(
    url.pathname.split(`/`).filter(Boolean).join(`/`)
  )
  const chapters = await fetchChapters()

  return { body: { page, chapters } }
}
