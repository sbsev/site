import type { PageLoad } from '@sveltejs/kit'
import { fetchPage, fetchYamlList } from 'src/fetch'

export const load: PageLoad = async () => {
  const page = await fetchPage(`auszeichnungen`)
  const awards = await fetchYamlList(`Auszeichnungen`, `auszeichnungen#`)

  return { page, awards }
}
