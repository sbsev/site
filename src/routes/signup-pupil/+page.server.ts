import { dev } from '$app/environment'
import { fetch_chapters, parse_form_data } from '$lib/fetch'
// to make the signup form i18n-compatible,
// these 3 files need to be imported adaptively (same in the student form)
import messages from '../../signup-form/de/messages.yml'
import options from '../../signup-form/de/options.yml'
import raw_form from '../../signup-form/de/pupil.yml'

export const load = async () => {
  let chapters = await fetch_chapters()
  chapters = chapters.filter((chap) => chap.signup == 'everyone')

  const form = parse_form_data({ ...raw_form, ...messages })

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
