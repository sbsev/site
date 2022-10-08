import { fetchPage, fetchYamlList } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  return {
    page: fetchPage(`lernmaterial`),
    studyPlatforms: fetchYamlList(`Lernmaterial`, `lernmaterial#`),
  }
}
