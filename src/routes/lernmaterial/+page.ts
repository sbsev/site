import { fetchPage, fetchYamlList } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const page = await fetchPage(`lernmaterial`)
  const studyPlatforms = await fetchYamlList(`Lernmaterial`, `lernmaterial#`)

  return { page, studyPlatforms }
}
