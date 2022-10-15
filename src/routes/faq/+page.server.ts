import { fetch_yaml_list } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return { faqs: fetch_yaml_list(`FAQ`, `faq#`) }
}
