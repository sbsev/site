import { fetch_page, fetch_yaml_list } from '$lib/fetch'

export const load = () => {
  return {
    page: fetch_page(`auszeichnungen`),
    awards: fetch_yaml_list(`Auszeichnungen`, `auszeichnungen#`),
  }
}
