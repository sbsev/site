import { fetchPage, fetchYamlList } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const page = await fetchPage(`auszeichnungen`)
  const awards = await fetchYamlList(`Auszeichnungen`, `auszeichnungen#`)

  return { page, awards }
}
