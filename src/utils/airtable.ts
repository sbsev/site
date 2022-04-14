// eslint-disable no-console
import { get } from 'svelte/store'
import { signupStore } from '../stores'
import type { Chapter, SignupStore } from '../types'

async function airtablePost(
  baseId: string,
  table: string,
  data: { [key: string]: unknown }
) {
  const response = await fetch(
    `https://api.github.com/repos/chris234567/actions-server/dispatches`,
    {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        'event_type': 'create-airtable-entry',
        'client_payload': { 
          'url': `https://api.airtable.com/v0/${baseId}/${table}`,
          'records': { records: [{ fields: data }], typecast: true } }
      }),
    }
  )
  return await response.json()
}

const toStr = (str: unknown) => (str ? String(str) : undefined)

export async function sendToAirtable(
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
    Bemerkung: toStr(data.remarks.value),
    Datenschutz: data.dataProtection.value,
    Quelle: `landing: ${location.origin}${window.visitedPages[1]}, prev: ${window.visitedPages[0]}`, // analytics
  }

  if (data.type.value === `student`) {
    const studentFields = {
      'Vor- und Nachname': data.fullName.value,
      Telefon: toStr(data.phone.value),
      Klassenstufen: toStr(data.levels.value) || `1-13`,
      Schulform: data.schoolTypes.value,
      // pass undefined in case Number(data.semester.value) is NaN (which Airtable can't handle)
      'Semester Anmeldung': Number(data.semester.value) || undefined,
      'E-Mail': toStr(data.email.value),
      Studienfach: data.studySubject.value,
      Geburtsort: toStr(data.birthPlace.value),
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
      Klassenstufe: toStr(data.level.value), // no fallback value here since it's a required field for pupils
      Schulform: data.schoolTypes.value?.[0],
      Geburtsdatum: data.birthYear.value + `-01-01`,
      Kontaktperson: data.nameContact.value,
      'E-Mail Kontaktperson': toStr(data.emailContact.value),
      'Telefon Kontaktperson': toStr(data.phoneContact.value),
      'Organisation Kontaktperson': toStr(data.orgContact.value),
      Werbemaßnahme: data.discovery.value?.[0],
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

  const chapterFields = { ...fields, Kontaktpersonen: data.nameContact?.value }

  const globalBaseId = `appSswal9DNdJKRB8` // global base called 'Alle Standorte' in Airtable
  const testBaseId = `appe3hVONuwBkuQv1` // called 'Anmeldeformular Test Base' in Airtable

  if (test) {
    console.log(`chapterFields:`, chapterFields) // eslint-disable-line no-console
    return await airtablePost(testBaseId, table, chapterFields)
  }
  // use Promise.all() to fail fast if one record creation fails
  return await Promise.all([
    airtablePost(globalBaseId, table, globalFields),
    airtablePost(chapterBaseId, table, chapterFields),
  ])
}

export async function submitHandler(
  fieldsToValidate: (keyof SignupStore)[],
  chapters: Chapter[],
  errMsg: Record<string, string>
): Promise<{ error?: Error; success?: boolean }> {
  // handles form validation and Plausible event reporting
  const signupData = get(signupStore)

  // form validation
  for (const name of fieldsToValidate) {
    const field = signupData[name]
    const isEmptyArr = Array.isArray(field.value) && !field.value.length
    if (field.required && (isEmptyArr || !field.value)) {
      try {
        field.error = errMsg.required
        signupStore.set(signupData)
        field.node?.focus()
        field.node?.scrollIntoView()
      } catch (error) {
        console.error(`error in validating field ${name}`, error)
      }
      return {} // abort submission
    }
  }

  const chapter = signupData.chapter.value?.[0]
  const type = signupData.type.value?.[0]
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
    const responses = await sendToAirtable(signupData, baseId)

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
