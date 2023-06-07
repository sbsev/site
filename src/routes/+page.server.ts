import { fetch_chapters, fetch_page } from '$lib/fetch'
import type { PageServerLoad } from './$types'

export const load = async () => {
  return {
    page: fetch_page(`/`),
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
