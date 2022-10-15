import { fetchPage, fetch_chapters } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  return {
    page: fetchPage(`/`),
    chapters: fetch_chapters(),
    // ...airtable_fetch(
    //   `{
    //     students: studentenStatistiken {
    //       id
    //     }
    //     pupils: schuelerStatistiken {
    //       id
    //     }
    //   }`,
    //   { cache: `force-cache` }
    // ),
  }
}
