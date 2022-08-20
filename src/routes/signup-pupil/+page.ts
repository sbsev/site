import { dev } from '$app/env'
import type { PageLoad } from '@sveltejs/kit'
import { fetchChapters, parseFormData } from 'src/fetch'
// to make the signup form i18n-compatible,
// these 3 files need to be imported adaptively (same in the student form)
import messages from 'src/signup-form/de/messages.yml'
import options from 'src/signup-form/de/options.yml'
import raw_form from 'src/signup-form/de/pupil.yml'

export const load: PageLoad = async () => {
  let chapters = await fetchChapters()
  chapters = chapters.filter((chap) => chap.acceptsSignups)

  const form = parseFormData({ ...raw_form, ...messages })

  if (dev) {
    chapters[0] = { ...chapters[0], title: `Test`, baseId: `appe3hVONuwBkuQv1` }
  }

  for (const field of form.fields) {
    if (field.id in options) {
      field.options = options[field.id]
    } else if (field.id === `chapter`) {
      field.options = chapters.map((chap) => chap.title)
    }
  }

  return { chapters, form }
}
