// eslint-disable no-console
import { get } from 'svelte/store'
import { signupStore as signup_store } from './stores'
import type { Chapter, SignupStore } from './types'


const azure_url = (base_id: string, table_id: string) =>
  `https://signup-sbs.azurewebsites.net/api/signup/${base_id}/${table_id}`

const to_str = (str: unknown) => (str ? String(str) : undefined)

// Send a POST request to the Airtable API to create new rows in the base and table
// specified by base_id and table_id.
async function azure_post_new_records(
  base_id: string,
  table_id: string,
  data: { [key: string]: unknown }
) {
  const response = await fetch(azure_url(base_id, table_id), {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({ records: [{ fields: data }], typecast: true }),
  })
  return await response.json()
}


// Prepares the form data
export async function prepare_signup_data_for_azure(
  data: SignupStore,
  chapter_base_id: string,
  test = false
): Promise<Response> {
  const table = data.type.value === `student` ? `Studenten` : `Schüler`

  // common fields for both students and pupils
  // we populate student/pupil-specific fields below
  let fields = {
    Adressen: Object.values(data.places?.value ?? [])
      .map((place) => place.address)
      .join(`\n`),
    Koordinaten: Object.values(data.places?.value ?? [])
      .map(({ lat, lng }) => `lat=${lat},lng=${lng}`)
      .join(`;`),

    // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
    // in Safari. Should do nothing in other browsers.

    Fächer: data.subjects.value,
    Geschlecht: data.gender.value,
    Bemerkung: to_str(data.remarks.value),
    Datenschutz: data.dataProtection.value,
    Quelle: `landing: ${location.origin}${window.visitedPages[1]}, prev: ${window.visitedPages[0]}`, // analytics
  }

  if (data.type.value === `student`) {
    const student_fields = {
      'Vor- und Nachname': data.fullName.value,
      Telefon: to_str(data.phone.value),
      Klassenstufen: to_str(data.levels.value) || `1-13`,
      Schulform: data.schoolTypes.value,
      // pass undefined in case Number(data.semester.value) is NaN (which Airtable can't handle)
      'Semester Anmeldung': Number(data.semester.value) || undefined,
      'E-Mail': to_str(data.email.value),
      Studienfach: data.studySubject.value,
      Geburtsort: to_str(data.birthPlace.value),
      Geburtsdatum: data.birthDate.value,
      Werbemaßnahme: data.discovery.value,
      // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
      // in Safari. Should do nothing in other browsers.
    }
    fields = { ...fields, ...student_fields }
  } else if (data.type.value === `pupil`) {
    // type === 'Pupil'
    const pupil_fields = {
      Vorname: data.firstName.value,
      Klassenstufe: to_str(data.level.value), // no fallback value here since it's a required field for pupils
      Schulform: data.schoolTypes.value,
      Geburtsdatum: data.birthYear.value + `-01-01`,
      Kontaktperson: data.nameContact.value,
      Kontaktpersonen: data.nameContact?.value,
      'E-Mail Kontaktperson': to_str(data.emailContact.value),
      'Telefon Kontaktperson': to_str(data.phoneContact.value),
      'Organisation Kontaktperson': to_str(data.orgContact.value),
      Werbemaßnahme: data.discovery.value,
      Online: data.online.value,
    }
    fields = { ...fields, ...pupil_fields }
  } else {
    console.error(`unknown signup type: ${data.type.value}`)
  }

  // fields not present in local chapter tables
  const globalFields = {
    ...fields,
    Standort: data.chapter.value,
    Spur: window.visitedPages.join(`,\n`),
  }

  const test_base_id = `appe3hVONuwBkuQv1` // called 'Anmeldeformular Test Base' in Airtable

  if (test) {
    console.log(`fields:`, fields) // eslint-disable-line no-console
    return await azure_post_new_records(test_base_id, table, fields)
  }
  return await azure_post_new_records(chapter_base_id, table, globalFields)
}

export async function signup_form_submit_handler(
  fields_to_validate: (keyof SignupStore)[],
  chapters: Chapter[],
  err_msg: Record<string, string>
): Promise<{ error?: Error; success?: boolean }> {
  // handles form validation and Plausible event reporting
  const signup_data = get(signup_store)

  // form validation
  for (const name of fields_to_validate) {
    const field = signup_data[name]
    const is_empty_arr = Array.isArray(field.value) && field.value.length === 0
    if (field.required && (is_empty_arr || !field.value)) {
      try {
        field.error = err_msg.required
        signup_store.set(signup_data)
        field.node?.focus()
        field.node?.scrollIntoView()
      } catch (error) {
        console.error(`error in validating field ${name}:`, error)
      }
      return {} // abort submission
    }
  }

  const chapter = signup_data.chapter.value
  const type = signup_data.type.value

  const baseId = chapters?.find(({ title }) => chapter?.includes(title))?.baseId
  if (!baseId) {
    const error = {
      name: `BaseIDError`,
      message: `baseId could not be determined`,
    }
    return { error }
  }

  try {

    const response = await prepare_signup_data_for_azure(signup_data, baseId)
    console.log("response", response)

    if (response.StatusCode !== 200) throw response.StatusCode

    window.plausible(`Signup`, {
      props: { chapter, type, 'chapter+type': `${type} aus ${chapter}` },
    })
    window.scrollTo({ top: 0, behavior: `smooth` })

    signup_store.set({} as SignupStore) // reset store for potential next signup
    return { success: true }
  } catch (err) {
    const error = err as Error // cast from unknown
    console.error(error)
    window.plausible(`Signup Error`, {
      props: {
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        chapter,
        type,
      },
    })
    return { error }
  }
}
