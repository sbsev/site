import { fetchYamlList } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return { faqs: fetchYamlList(`FAQ`, `faq#`) }
}
