import { fetch_yaml_list } from '$lib/fetch'

export const load = async () => {
  return { faqs: await fetch_yaml_list(`FAQ`, `faq#`) }
}
