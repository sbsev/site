import type { RequestHandler } from '@sveltejs/kit'
import { fetchPage } from '../../fetch'

export const get: RequestHandler = async ({ params }) => {
  const { slug } = params

  const page = await fetchPage(`standorte/${slug}`)

  if (page) return { body: { page, slug } }
  else return { status: 404 }
}
