import type { PageLoad } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

// This is an automatic forward for a legacy url
export const load: PageLoad = ({ url }) => {
  const type = url.searchParams.get(`type`) ?? `Student`

  const redirect_map = {
    Schüler: `pupil`,
    Student: `student`,
  }
  const slug = redirect_map[type as keyof typeof redirect_map]

  if (!slug) throw `Unknown type: ${type}`

  throw redirect(307, `/signup-${slug}`)
}
