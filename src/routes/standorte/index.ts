import type { RequestHandler } from '@sveltejs/kit'
import { fetchChapters, fetchPage } from '../../fetch'

export const get: RequestHandler = async () => {
  const page = await fetchPage(`standorte`)
  const chapters = await fetchChapters()

  return { body: { page, chapters } }
}
