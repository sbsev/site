import { fetchChapters, fetchPage } from '$lib/fetch'
import type { PageLoad } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  const page = await fetchPage(`/`)
  const chapters = await fetchChapters()

  // const { students, pupils } = await airtableFetch(
  //   `{
  //     students: studentenStatistiken {
  //       id
  //     }
  //     pupils: schuelerStatistiken {
  //       id
  //     }
  //   }`,
  //   { cache: `force-cache` }
  // )
  return { page, chapters }
}
