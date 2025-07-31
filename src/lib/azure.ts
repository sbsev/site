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
  data: { [key: string]: unknown },
) {
  const response = await fetch(azure_url(base_id, table_id), {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({ records: [{ fields: data }], typecast: true }),
  })

  // Return both the status and the JSON data
  const jsonData = await response.json()
  return {
    status: response.status,
    data: jsonData,
  }
}

// Prepares the form data
export async function prepare_signup_data_for_azure(
  data: SignupStore,
  chapter_base_id: string,
  test = false,
): Promise<{ status: number; data: any }> {
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
  err_msg: Record<string, string>,
): Promise<{ error?: Error; success?: boolean }> {
  // handles form validation and Plausible event reporting
  const signup_data = get(signup_store)

  // form validation - defensive approach
  for (const name of fields_to_validate) {
    try {
      const field = signup_data[name]

      // Skip if field doesn't exist or isn't properly initialized
      if (!field || typeof field !== 'object') {
        console.warn(`Field ${name} is not properly initialized`)
        continue
      }

      // Skip if field is not required
      if (!field.required) {
        continue
      }

      // Check if field value is empty
      const fieldValue = field.value
      let isEmpty = false

      if (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === ''
      ) {
        isEmpty = true
      } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
        isEmpty = true
      } else if (fieldValue === 0 && name !== 'level' && name !== 'birthYear') {
        // 0 is empty except for numeric fields like level and birthYear
        isEmpty = true
      }

      if (isEmpty) {
        // Field is required but empty
        try {
          field.error = err_msg?.required || 'This field is required'
          signup_store.set(signup_data)

          // Try to focus and scroll to the field
          if (field.node && typeof field.node.focus === 'function') {
            field.node.focus()
            field.node.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        } catch (focusError) {
          console.error(`Error focusing field ${name}:`, focusError)
        }

        return {} // abort submission
      }
    } catch (fieldError) {
      console.error(`Error processing field ${name}:`, fieldError)
      continue
    }
  }

  const chapter = signup_data.chapter?.value
  const type = signup_data.type?.value

  if (!chapter || !type) {
    const error = new Error(
      `Missing required form data: chapter=${chapter}, type=${type}`,
    )
    return { error }
  }

  const baseId = chapters?.find(({ title }) => chapter?.includes(title))?.baseId
  if (!baseId) {
    const error = new Error(
      `baseId could not be determined for chapter: ${chapter}`,
    )
    return { error }
  }

  try {
    console.log('Preparing signup data for Azure...')
    let response
    try {
      response = await prepare_signup_data_for_azure(signup_data, baseId)
    } catch (prepareError) {
      console.error('Error in prepare_signup_data_for_azure:', prepareError)
      throw prepareError
    }

    console.log('Azure response:', response)
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response from Azure')
    }

    // Check if response has status property
    if (!response.hasOwnProperty('status') || response.status !== 200) {
      throw new Error(
        `Azure request failed with status: ${response.status || 'unknown'}`,
      )
    }

    console.log('Calling plausible...')
    try {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(`Signup`, {
          props: { chapter, type, 'chapter+type': `${type} aus ${chapter}` },
        })
      }
    } catch (plausibleError) {
      console.error('Error calling plausible:', plausibleError)
      // Don't throw, just log - plausible errors shouldn't break submission
    }

    console.log('Scrolling to top...')
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: `smooth` })
      }
    } catch (scrollError) {
      console.error('Error scrolling:', scrollError)
      // Don't throw, just log
    }

    console.log('Resetting signup store...')
    try {
      signup_store.set({} as SignupStore) // reset store for potential next signup
    } catch (storeError) {
      console.error('Error resetting store:', storeError)
      // Don't throw, just log
    }

    return { success: true }
  } catch (err) {
    console.error('Caught error - type:', typeof err, 'value:', err)

    // Safely serialize error for Plausible
    let errorInfo: string
    try {
      if (err && typeof err === 'object' && err.constructor === Error) {
        errorInfo = JSON.stringify(err, Object.getOwnPropertyNames(err))
      } else {
        errorInfo = String(err)
      }
    } catch (serializationError) {
      errorInfo = `Serialization failed: ${String(err)}`
    }

    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(`Signup Error`, {
        props: {
          error: errorInfo,
          chapter,
          type,
        },
      })
    }
    return { error: err as Error }
  }
}
