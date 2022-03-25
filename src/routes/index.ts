import type { RequestHandler } from '@sveltejs/kit'
import { airtableFetch, fetchChapters, fetchPage } from '../fetch'

export const get: RequestHandler = async () => {
  const page = await fetchPage(`/`)
  const chapters = await fetchChapters()

  const { students, pupils } = await airtableFetch<{
    students: number[]
    pupils: number[]
  }>(
    `{
          students: studentenStatistiken {
            id
          }
          pupils: schuelerStatistiken {
            id
          }
        }`,
    { cache: `force-cache` }
  )

  return {
    body: {
      page,
      chapters,
      counts: { students: students.length, pupils: pupils.length },
    },
  }
}
