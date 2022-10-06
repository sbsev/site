import { fetchChapters, fetchPage } from '$lib/fetch'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  return {
    page: fetchPage(`/`),
    chapters: fetchChapters(),
    // ...airtableFetch(
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
