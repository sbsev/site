import { fetchYamlList } from '$lib/fetch'
import type { PageLoad } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  const faqs = await fetchYamlList(`FAQ`, `faq#`)
  return { faqs }
}
