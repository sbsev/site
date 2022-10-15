import { fetchPage, fetchYamlList } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return {
    page: fetchPage(`auszeichnungen`),
    awards: fetchYamlList(`Auszeichnungen`, `auszeichnungen#`),
  }
}
