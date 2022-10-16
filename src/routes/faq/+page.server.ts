import { fetch_yaml_list } from '$lib/fetch'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return { faqs: fetch_yaml_list(`FAQ`, `faq#`) }
}
