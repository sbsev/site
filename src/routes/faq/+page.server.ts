import { fetch_yaml_list } from '$lib/fetch'

export const load = () => {
  return { faqs: fetch_yaml_list(`FAQ`, `faq#`) }
}
