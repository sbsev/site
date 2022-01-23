import { get } from 'svelte/store'
import { signupStore } from '../stores'
import type { Chapter, SignupStore } from '../types'

async function airtablePost(
  baseId: string,
  table: string,
  data: { [key: string]: unknown },
  apiKey: string
) {
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${table}`,
    {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ records: [{ fields: data }], typecast: true }),
    }
  )
  return await response.json()
}

const toStr = (str: unknown) => (str ? String(str) : undefined)

export async function sendToAirtable(
  chapterBaseId: string,
  apiKey: string,
  test = false
) {
  const data = get(signupStore)

  if (!apiKey) throw `missing Airtable API key, got ${apiKey}`
  const table = data.type.value === `Student` ? `Studenten` : `Schüler`

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
    'E-Mail': toStr(data.email.value),
    Geburtsdatum: data.birthDate?.value ?? data.birthYear?.value,
    Fächer: data.subjects.value,
    Geschlecht: data.gender.value?.[0],
    Bemerkung: toStr(data.remarks.value),
    Datenschutz: data.dataProtection.value,
    Quelle: `landing: ${location.origin}${window.visitedPages[1]}, prev: ${window.visitedPages[0]}`, // analytics
  }

  if (data.type.value === `Student`) {
    const studentFields = {
      'Vor- und Nachname': data.fullName.value,
      Telefon: toStr(data.phone.value),
      Klassenstufen: toStr(data.levels.value) || `1-13`,
      Schulform: data.schoolTypes.value,
      // pass undefined in case Number(data.semester.value) is NaN (which Airtable can't handle)
      'Semester Anmeldung': Number(data.semester.value) || undefined,
      Studienfach: data.studySubject.value,
      Geburtsort: toStr(data.birthPlace.value),
      Werbemaßnahme: data.discovery.value.join(`;`),
      // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
      // in Safari. Should do nothing in other browsers.
    }
    fields = { ...fields, ...studentFields }
  } else if (data.type.value === `Pupil`) {
    // type === 'Pupil'
    const pupilFields = {
      Vorname: data.firstName.value,
      Klassenstufe: toStr(data.level.value), // no fallback value here since it's a required field for pupils
      Schulform: data.schoolType.value?.[0],
      Kontaktperson: data.nameContact.value,
      'E-Mail Kontaktperson': toStr(data.emailContact.value),
      'Telefon Kontaktperson': toStr(data.phoneContact.value),
      'Organisation Kontaktperson': toStr(data.orgContact.value),
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

  const chapterFields = { ...fields, Kontaktpersonen: data.nameContact.value }

  const globalBaseId = `appSswal9DNdJKRB8` // global base called 'Alle Standorte' in Airtable
  const testBaseId = `appe3hVONuwBkuQv1` // called 'Anmeldeformular Test Base' in Airtable

  if (test) {
    console.log(`chapterFields:`, chapterFields) // eslint-disable-line no-console
    return await airtablePost(testBaseId, table, chapterFields, apiKey)
  }
  // use Promise.all() to fail fast if one record creation fails
  const responses = await Promise.all([
    airtablePost(globalBaseId, table, globalFields, apiKey),
    airtablePost(chapterBaseId, table, chapterFields, apiKey),
  ])
  const err = responses.find((res) => `error` in res)
  if (err) throw err
  else return responses[0]
}

export async function submitHandler(
  chapters: Chapter[],
  airtableApiKey: string
): Promise<{ error?: Error; resp?: Response }> {
  const signupData = get(signupStore)

  // form validation
  for (const field of Object.values(signupData)) {
    const isEmptyArr = Array.isArray(field.value) && !field.value.length
    if (field.required && (isEmptyArr || !field.value)) {
      field.error = `Dieses Feld ist erforderlich`
      signupStore.set(signupData)
      field.node?.focus()
      field.node?.scrollIntoView()
      return {} // abort submission
    }
  }

  const { chapter, type } = signupData
  const chapterAndType = {
    chapter: chapter.value?.[0],
    type,
    'chapter+type': `${type} aus ${chapter.value?.[0]}`,
  }

  const baseId = chapters?.find(({ title }) =>
    chapter.value?.[0].includes(title)
  )?.baseId
  if (!baseId) {
    const error = {
      name: `BaseIDError`,
      message: `baseId could not be determined`,
    }
    return { error }
  }

  try {
    const resp = await sendToAirtable(baseId, airtableApiKey)

    window.plausible(`Signup`, { props: chapterAndType })
    window.scrollTo({ top: 0, behavior: `smooth` })

    signupStore.set({} as SignupStore) // reset store for potential next signup
    return { resp }
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
