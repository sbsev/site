import type { PageLoad } from '@sveltejs/kit'
import { fetchPage, fetchYamlList } from 'src/fetch'

export const load: PageLoad = async () => {
  const page = await fetchPage(`presse`)

  const pressItems = await fetchYamlList(`Presse`, `presse#`)

  const itemsByYear = pressItems.reduce((acc, itm) => {
    const year = itm.date.getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(itm)
    return acc
  }, {})

  return { page, pressItems: itemsByYear }
}
