import { fetch_page, fetch_yaml_list } from '$lib/fetch'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return {
    page: fetch_page(`presse`),
    pressItems: fetch_yaml_list(`Presse`, `presse#`).then((items) => {
      return items.reduce((acc, itm) => {
        // split items into sub-lists by year
        const year = itm.date.getFullYear()
        if (!acc[year]) acc[year] = []
        acc[year].push(itm)
        return acc
      }, {})
    }),
  }
}
