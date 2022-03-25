import type { RequestHandler } from '@sveltejs/kit'
import { fetchPost } from '../../fetch'

export const get: RequestHandler = async ({ params }) => {
  const post = await fetchPost(params.slug)

  if (post) return { body: { post } }
  else return { status: 404 }
}
