import { dev } from '$app/env'
import { fetchChapters, parseFormData } from '$lib/fetch'
import type { PageLoad } from '@sveltejs/kit'
// to make the signup form i18n-compatible,
// these 3 files need to be imported adaptively (same in the student form)
import { microcopy } from '$lib/stores'
import { get } from 'svelte/store'

var country = get(microcopy).country

// import messages from '../../signup-form/de/messages.yml'
// import options from '../../signup-form/de/options.yml'
// import raw_form from '../../signup-form/de/pupil.yml'
import type { _ } from '$env/static/private'

export const load: PageLoad = async () => {
  // this does not work yet, when the url is directly called
  // The problem is that microcopy is undefined when the page is loaded directly
  const messages = (await import(`../../signup-form/${country}/messages.yml`))
    .default
  const options = (await import(`../../signup-form/${country}/options.yml`))
    .default
  const raw_form = (await import(`../../signup-form/${country}/pupil.yml`))
    .default

  console.log('files loaded1:', raw_form, messages)
  let chapters = await fetchChapters()
  chapters = chapters.filter((chap) => chap.acceptsSignups)
  console.log('files loaded:', raw_form, messages)

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
