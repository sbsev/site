import type { PageLoad } from '@sveltejs/kit'
import { fetchYamlList } from '../../fetch'

export const load: PageLoad = async () => {
  const faqs = await fetchYamlList(`FAQ`, `faq#`)
  return { faqs }
}
