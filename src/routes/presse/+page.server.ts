import { fetch_page, fetch_yaml_list } from '$lib/fetch'

export const load = async () => {
  const pressItems = await fetch_yaml_list(`Presse`, `presse#`)
  const itemsByYear = pressItems.reduce((acc, itm) => {
    // split items into sub-lists by year
    const year = itm.date.getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(itm)
    return acc
  }, {})

  return {
    page: await fetch_page(`presse`),
    pressItems: itemsByYear,
  }
}
