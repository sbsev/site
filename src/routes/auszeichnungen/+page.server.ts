import { fetch_page, fetch_yaml_list } from '$lib/fetch'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return {
    page: fetch_page(`auszeichnungen`),
    awards: fetch_yaml_list(`Auszeichnungen`, `auszeichnungen#`),
  }
}
