import { fetch_page, fetch_yaml_list } from '$lib/fetch'

export const load = async () => {
  return {
    page: await fetch_page(`lernmaterial`),
    studyPlatforms: await fetch_yaml_list(`Lernmaterial`, `lernmaterial#`),
  }
}
