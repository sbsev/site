// eslint-disable no-console
import { get } from 'svelte/store'
import { signupStore } from './stores'
import type { Chapter, SignupStore } from './types'

const api_key = import.meta.env.VITE_AIRTABLE_API_KEY
if (!api_key) throw new Error(`missing Airtable API key, got ${api_key}`)

// Send a POST request to the Airtable API to create new rows in the base and table
// specified by base_id and table_id.
async function airtable_post_new_records(
  base_id: string,
  table_id: string,
  data: { [key: string]: unknown }
) {
  const response = await fetch(
    `https://api.airtable.com/v0/${base_id}/${table_id}`,
    {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
        authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({ records: [{ fields: data }], typecast: true }),
    }
  )
  return await response.json()
}

const to_str = (str: unknown) => (str ? String(str) : undefined)

export async function prepare_signup_data_for_airtable(
  data: SignupStore,
  chapterBaseId: string,
  test = false
): Promise<Response[]> {
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
    Geschlecht: data.gender.value?.[0],
    Bemerkung: to_str(data.remarks.value),
    Datenschutz: data.dataProtection.value,
    Quelle: `landing: ${location.origin}${window.visitedPages[1]}, prev: ${window.visitedPages[0]}`, // analytics
  }

  if (data.type.value === `student`) {
    const studentFields = {
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
      Werbemaßnahme: data.discovery.value?.[0],
      // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
      // in Safari. Should do nothing in other browsers.
    }
    fields = { ...fields, ...studentFields }
  } else if (data.type.value === `pupil`) {
    // type === 'Pupil'
    const pupilFields = {
      Vorname: data.firstName.value,
      Klassenstufe: to_str(data.level.value), // no fallback value here since it's a required field for pupils
      Schulform: data.schoolTypes.value?.[0],
      Geburtsdatum: data.birthYear.value + `-01-01`,
      Kontaktperson: data.nameContact.value,
      Kontaktpersonen: data.nameContact?.value,
      'E-Mail Kontaktperson': to_str(data.emailContact.value),
      'Telefon Kontaktperson': to_str(data.phoneContact.value),
      'Organisation Kontaktperson': to_str(data.orgContact.value),
      Werbemaßnahme: data.discovery.value,
      Online: data.online.value,
    }
    fields = { ...fields, ...pupilFields }
  } else {
    console.error(`unknown signup type: ${data.type.value}`)
  }

  // fields not present in local chapter tables
  const globalFields = {
    ...fields,
    Standort: data.chapter.value?.[0],
    Spur: window.visitedPages.join(`,\n`),
  }

  const globalBaseId = `appSswal9DNdJKRB8` // global base called 'Alle Standorte' in Airtable
  const testBaseId = `appe3hVONuwBkuQv1` // called 'Anmeldeformular Test Base' in Airtable

  if (test) {
    console.log(`fields:`, fields) // eslint-disable-line no-console
    return await airtable_post_new_records(testBaseId, table, fields)
  }
  // use Promise.all() to fail fast if one record creation fails
  return await Promise.all([
    airtable_post_new_records(globalBaseId, table, globalFields),
    airtable_post_new_records(chapterBaseId, table, fields),
  ])
}

export async function signup_form_submit_handler(
  fields_to_validate: (keyof SignupStore)[],
  chapters: Chapter[],
  err_msg: Record<string, string>
): Promise<{ error?: Error; success?: boolean }> {
  // handles form validation and Plausible event reporting
  const signupData = get(signupStore)

  // form validation
  for (const name of fields_to_validate) {
    const field = signupData[name]
    const isEmptyArr = Array.isArray(field.value) && !field.value.length
    if (field.required && (isEmptyArr || !field.value)) {
      try {
        field.error = err_msg.required
        signupStore.set(signupData)
        field.node?.focus()
        field.node?.scrollIntoView()
      } catch (error) {
        console.error(`error in validating field ${name}:`, error)
      }
      return {} // abort submission
    }
  }

  const chapter = signupData.chapter.value?.[0]
  const type = signupData.type.value
  const chapterAndType = {
    chapter: chapter,
    type,
    'chapter+type': `${type} aus ${chapter}`,
  }

  const baseId = chapters?.find(({ title }) => chapter?.includes(title))?.baseId
  if (!baseId) {
    const error = {
      name: `BaseIDError`,
      message: `baseId could not be determined`,
    }
    return { error }
  }

  try {
    const responses = await prepare_signup_data_for_airtable(signupData, baseId)

    const err = responses.find((res) => `error` in res)
    if (err) throw err

    window.plausible(`Signup`, { props: chapterAndType })
    window.scrollTo({ top: 0, behavior: `smooth` })

    signupStore.set({} as SignupStore) // reset store for potential next signup
    return { success: true }
  } catch (err) {
    const error = err as Error // cast from unknown
    console.error(error)
    window.plausible(`Signup Error`, {
      props: {
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ...chapterAndType,
      },
    })
    return { error }
  }
}
