export function tryParse(str) {
  try {
    return JSON.parse(str)
  } catch (_) {
    return str
  }
}

async function airtablePost(baseId, table, data, apiKey) {
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

const toStr = (str) => (str ? String(str) : undefined)

export async function airtableSubmit(chapterBaseId, data, apiKey, test) {
  if (!apiKey) throw `missing Airtable API key, got ${apiKey}`
  const table = data.type === `Student` ? `Studenten` : `Schüler`

  // convert pupil age to approximate birthday (assuming today's day and month)
  if (data.age) {
    const date = new Date()
    date.setFullYear(date.getFullYear() - data.age)
    data.birthDate = date
  }

  const fields = {
    'Vor- und Nachname': data.fullname, // for students
    Vorname: data.firstname, // for pupils
    Telefon: toStr(data.phone), // for students
    'E-Mail': toStr(data.email),
    Bemerkung: toStr(data.remarks),
    'Geografische Präferenz': toStr(data.place),
    Klassenstufen: toStr(data.levels), // for students
    Klassenstufe: toStr(data.level), // for pupils
    Fächer: data.subjects,
    Schulform: data.schoolTypes, // for pupils
    Werbemaßnahme: data.discovery,
    Geschlecht: data.gender,
    'Semester Anmeldung': Number(data.semester) || undefined, // for students
    // pass undefined in case Number(data.semester) is NaN
    Studienfach: data.studySubject, // for students
    Geburtsort: toStr(data.birthPlace), // for students
    // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
    // in Safari. Should do nothing in other browsers.
    Geburtsdatum:
      typeof data.birthDate === `string`
        ? data.birthDate.split(`.`).reverse().join(`-`)
        : data.birthDate,
    Datenschutz: data.dataProtection,
    Kontaktperson: data.nameContact, // for pupils
    'E-Mail Kontaktperson': toStr(data.emailContact), // for pupils
    'Telefon Kontaktperson': toStr(data.phoneContact), // for pupils
    'Organisation Kontaktperson': toStr(data.orgContact), // for pupils
    Quelle: `landing: ${location.origin}${window.locations[1]}, prev: ${window.locations[0]}`, // analytics
  }

  // some chapters organize contact persons little differently than others
  if (data.chapter === `Halle` && table === `Schüler`) {
    fields.Kontaktperson = `${data.nameContact}; ${data.orgContact}; ${data.emailContact}; ${data.phoneContact}`
    fields[`E-Mail Kontaktperson`] = undefined
    fields[`Telefon Kontaktperson`] = undefined
    fields[`Organisation Kontaktperson`] = undefined
  }

  // fields not present in local chapter tables
  const globalFields = {
    ...fields,
    Standort: data.chapter,
    Spur: window.locations.join(`,\n`),
  }
  const chapterFields = { ...fields, Kontaktpersonen: data.nameContact }

  const globalBaseId = `appSswal9DNdJKRB8`
  const testBaseId = `appe3hVONuwBkuQv1` // id of test base called 'Verification' in Airtable

  if (test) return await airtablePost(testBaseId, table, chapterFields, apiKey)
  // use Promise.all to fail fast if one record creation fails
  const responses = await Promise.all([
    airtablePost(globalBaseId, table, globalFields, apiKey),
    airtablePost(chapterBaseId, table, chapterFields, apiKey),
  ])
  return responses.find((res) => `error` in res) || responses[0]
}
