import type { PageLoad } from '@sveltejs/kit'
import { fetchYamlList } from 'src/fetch'

export const load: PageLoad = async () => {
  const faqs = await fetchYamlList(`FAQ`, `faq#`)
  return { faqs }
}
