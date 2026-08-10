// Direct Airtable API integration for signup form submissions
import { get } from 'svelte/store'
import { signupStore as signup_store } from './stores'
import type { Chapter, SignupStore } from './types'

const airtable_url = (base_id: string, table_name: string) =>
  `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table_name)}`

const to_str = (str: unknown) => (str ? String(str) : undefined)

// Send a POST request to the Airtable API to create new records
async function airtable_post_new_records(
  base_id: string,
  table_name: string,
  data: { [key: string]: unknown },
): Promise<{ status: number; data: unknown; error?: unknown }> {
  const token = import.meta.env.VITE_AIRTABLE_WRITE_TOKEN
  if (!token) {
    console.error(`Missing VITE_AIRTABLE_WRITE_TOKEN environment variable`)
    return { status: 500, data: null, error: `Missing API token` }
  }

  try {
    const response = await fetch(airtable_url(base_id, table_name), {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ records: [{ fields: data }], typecast: true }),
    })
    const jsonData = await response.json()
    return { status: response.status, data: jsonData }
  } catch (err) {
    console.error(`Airtable fetch error:`, err)
    return { status: 500, data: null, error: err }
  }
}

// Configuration - uses env vars with fallbacks to production values
const GLOBAL_BASE_ID =
  import.meta.env.VITE_AIRTABLE_GLOBAL_BASE_ID || `appSswal9DNdJKRB8`
const ERROR_LOG_TABLE = `Anmeldefehler`

// Log signup errors to Airtable for monitoring
async function log_error_to_airtable(
  error: Error,
  signup_data: SignupStore,
  chapter?: string,
  type?: string,
): Promise<void> {
  try {
    // Extract email based on signup type
    const email =
      type === `student`
        ? signup_data.email?.value
        : signup_data.emailContact?.value

    const error_fields = {
      Timestamp: new Date().toISOString(),
      'Error Message': error.message || String(error),
      'Stack Trace': error.stack || ``,
      Email: email ? String(email) : ``,
      'Form Data': JSON.stringify(signup_data, null, 2).slice(0, 10000), // Airtable has field limits
      Chapter: chapter || ``,
      Type: type || ``,
    }

    await airtable_post_new_records(
      GLOBAL_BASE_ID,
      ERROR_LOG_TABLE,
      error_fields,
    )
  } catch (logError) {
    // Don't let error logging failures affect the user experience
    console.error(`Failed to log error to Airtable:`, logError)
  }
}

export async function prepare_signup_data_for_airtable(
  data: SignupStore,
  chapter_base_id: string,
  tableName: string,
): Promise<{ status: number; data: unknown }> {
  const table = tableName

  // Common fields for both students and pupils
  let fields = {
    Adressen: Object.values(data.places?.value ?? [])
      .map((place) => place.address)
      .join(`\n`),
    Koordinaten: Object.values(data.places?.value ?? [])
      .map(({ lat, lng }) => `lat=${lat},lng=${lng}`)
      .join(`;`),
    Fächer: data.subjects.value,
    Geschlecht: data.gender.value,
    Bemerkung: to_str(data.remarks.value),
    Datenschutz: data.dataProtection.value,
    Quelle: `landing: ${location.origin}${window.visitedPages?.[1] || ``}, prev: ${window.visitedPages?.[0] || ``}`,
    Werbemaßnahme: data.discovery.value,
  }

  if (data.type.value === `student`) {
    const student_fields = {
      'Vor- und Nachname': data.fullName.value,
      Telefon: to_str(data.phone.value),
      Klassenstufen: to_str(data.levels.value) || `1-13`,
      Schulform: data.schoolTypes.value,
      'Semester Anmeldung': Number(data.semester.value) || undefined,
      'E-Mail': to_str(data.email.value),
      Studienfach: data.studySubject.value,
      Geburtsort: to_str(data.birthPlace.value),
      Geburtsdatum: data.birthDate.value,
    }
    fields = { ...fields, ...student_fields }
  } else if (data.type.value === `pupil`) {
    const pupil_fields = {
      Vorname: data.firstName.value,
      Klassenstufe: to_str(data.level.value),
      Schulform: data.schoolTypes.value,
      Geburtsdatum: data.birthYear.value
        ? data.birthYear.value + `-01-01`
        : undefined,
      Kontaktperson: data.nameContact.value,
      Kontaktpersonen: data.nameContact?.value,
      'E-Mail Kontaktperson': to_str(data.emailContact.value),
      'Telefon Kontaktperson': to_str(data.phoneContact.value),
      'Organisation Kontaktperson': to_str(data.orgContact.value),

      Online: data.online.value,
    }
    fields = { ...fields, ...pupil_fields }
  } else {
    console.error(`Unknown signup type: ${data.type.value}`)
  }

  // Global table gets Standort/Spur for cross-chapter tracking
  const globalFields = {
    ...fields,
    Standort: data.chapter.value,
    Spur: window.visitedPages?.join(`,\n`) || ``,
  }

  // Send to both global and chapter tables, collect all errors
  const results = await Promise.allSettled([
    airtable_post_new_records(GLOBAL_BASE_ID, table, globalFields),
    airtable_post_new_records(chapter_base_id, table, fields),
  ])

  // Collect errors from both requests
  const errors: string[] = []

  results.forEach((result, idx) => {
    const tableName = idx === 0 ? 'Global' : 'Chapter'
    if (result.status === 'rejected') {
      errors.push(`${tableName}: ${result.reason}`)
    } else if (result.value.status < 200 || result.value.status >= 300) {
      errors.push(
        `${tableName} (${result.value.status}): ${JSON.stringify(result.value.data)}`,
      )
    }
  })

  if (errors.length > 0) {
    console.error(`Airtable errors:`, errors)
    // Strict: any error = failure, even if one table succeeded
    return {
      status: 422,
      data: { errors },
    }
  }

  return {
    status: 200,
    data: results.map((r) => (r.status === 'fulfilled' ? r.value.data : null)),
  }
}

export async function signup_form_submit_handler(
  fields_to_validate: (keyof SignupStore)[],
  chapters: Chapter[],
  err_msg: Record<string, string>,
  tableName: string,
): Promise<{ error?: Error; success?: boolean }> {
  const signup_data = get(signup_store)

  // Form validation
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
        console.error(`Error validating field ${name}:`, error)
      }
      return {} // abort submission
    }
  }

  const chapter = signup_data.chapter.value
  const type = signup_data.type.value

  const baseId = chapters?.find(({ title }) => chapter?.includes(title))?.baseId
  if (!baseId) {
    const error = new Error(
      `baseId could not be determined for chapter: ${chapter}`,
    )
    error.name = `BaseIDError`
    return { error }
  }

  try {
    const response = await prepare_signup_data_for_airtable(
      signup_data,
      baseId,
      tableName,
    )

    if (response.status < 200 || response.status >= 300) {
      // Include Airtable's error response for debugging
      const airtableError = JSON.stringify(response.data, null, 2)
      console.error(`Airtable error response:`, response.data)
      throw new Error(
        `Airtable request failed with status: ${response.status}\n${airtableError}`,
      )
    }

    // Check for partial failure - occurs when one of the two Airtable writes
    // (global table or chapter table) succeeds while the other fails
    const responseData = response.data as {
      errors?: string[]
      partialSuccess?: boolean
    }
    if (responseData?.errors && responseData.errors.length > 0) {
      // Log partial failure to Airtable error log
      const partialError = new Error(
        `Partial failure: ${responseData.errors.join('; ')}`,
      )
      partialError.name = 'PartialSubmitError'
      const chapterStr = Array.isArray(chapter) ? chapter.join(`, `) : chapter
      await log_error_to_airtable(partialError, signup_data, chapterStr, type)
      console.warn(`Partial signup failure logged:`, responseData.errors)
    }

    // Track successful signup
    window.plausible?.(`Signup`, {
      props: { chapter, type, 'chapter+type': `${type} aus ${chapter}` },
    })
    window.scrollTo({ top: 0, behavior: `smooth` })

    signup_store.set({} as SignupStore) // reset store for potential next signup
    return { success: true }
  } catch (err) {
    const error = err as Error
    console.error(`Signup error:`, error)

    // Log error to Airtable with user email
    const chapterStr = Array.isArray(chapter) ? chapter.join(`, `) : chapter
    await log_error_to_airtable(error, signup_data, chapterStr, type)

    // Track error in Plausible
    window.plausible?.(`Signup Error`, {
      props: {
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        chapter,
        type,
      },
    })
    return { error }
  }
}
