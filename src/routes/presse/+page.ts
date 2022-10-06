import { fetchPage, fetchYamlList } from '$lib/fetch'
import type { PageLoad } from './$types'

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
