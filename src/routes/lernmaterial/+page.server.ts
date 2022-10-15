import { fetchPage, fetch_yaml_list } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return {
    page: fetchPage(`lernmaterial`),
    studyPlatforms: fetch_yaml_list(`Lernmaterial`, `lernmaterial#`),
  }
}
