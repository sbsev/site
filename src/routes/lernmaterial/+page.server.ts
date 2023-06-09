import { fetch_page, fetch_yaml_list } from '$lib/fetch'

export const load = () => {
  return {
    page: fetch_page(`lernmaterial`),
    studyPlatforms: fetch_yaml_list(`Lernmaterial`, `lernmaterial#`),
  }
}
