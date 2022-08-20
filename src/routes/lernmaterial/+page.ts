import { fetchPage, fetchYamlList } from '$lib/fetch'
import type { PageLoad } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  const page = await fetchPage(`lernmaterial`)
  const studyPlatforms = await fetchYamlList(`Lernmaterial`, `lernmaterial#`)

  return { page, studyPlatforms }
}
