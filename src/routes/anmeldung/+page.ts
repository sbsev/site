import type { PageLoad } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
// This is an automatic forward for a legacy url
export const load: PageLoad = ({ url }) => {
  const type = url.searchParams.get(`type`) === `Schüler` ? `pupil` : `student`
  throw redirect(307, `/signup-${type}`)
}
