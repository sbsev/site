import type { PageLoad } from '@sveltejs/kit'
import { fetchPage, fetchYamlList } from '../../fetch'

export const load: PageLoad = async () => {
  const page = await fetchPage(`lernmaterial`)
  const studyPlatforms = await fetchYamlList(`Lernmaterial`, `lernmaterial#`)

  return { page, studyPlatforms }
}
