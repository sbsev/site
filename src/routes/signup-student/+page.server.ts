import { loadSignupForm } from '$lib/server/signup-form'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, parent }) => {
  const { smallTexts } = await parent()
  return loadSignupForm(`student`, smallTexts.country, fetch)
}
