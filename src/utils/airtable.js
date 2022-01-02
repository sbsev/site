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

  // common fields for both students and pupils
  // we populate student/pupil-specific fields below
  let fields = {
    // formatted address provided by Google Maps Places API
    Adressen: Object.values(data.places)
      .map((place) => place.address)
      .join(`\n`),
    Koordinaten: Object.values(data.places)
      .map((place) => place.coords)
      .join(`;`),
    // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
    // in Safari. Should do nothing in other browsers.
    'E-Mail': toStr(data.email),
    Geburtsdatum:
      typeof data.birthDate === `string`
        ? data.birthDate.split(`.`).reverse().join(`-`)
        : data.birthDate,
    Fächer: data.subjects,
    Werbemaßnahme: data.discovery.join(`;`),
    Geschlecht: data.gender[0],
    Bemerkung: toStr(data.remarks),
    Datenschutz: data.dataProtection,
    Quelle: `landing: ${location.origin}${window.locations[1]}, prev: ${window.locations[0]}`, // analytics
  }

  if (data.type === `Student`) {
    const studentFields = {
      'Vor- und Nachname': data.fullname,
      Telefon: toStr(data.phone),
      'Geografische Präferenz': toStr(data.place),
      Klassenstufen: toStr(data.levels) || `1-13`,
      Schulform: data.schoolTypes,
      // pass undefined in case Number(data.semester) is NaN (which Airtable can't handle)
      'Semester Anmeldung': Number(data.semester) || undefined,
      Studienfach: data.studySubject,
      Geburtsort: toStr(data.birthPlace),
      // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
      // in Safari. Should do nothing in other browsers.
    }
    fields = { ...fields, ...studentFields }
  } else if (data.type === `Pupil`) {
    // type === 'Pupil'
    const pupilFields = {
      Vorname: data.firstname,
      'Geografische Präferenz': toStr(data.place),
      Klassenstufe: toStr(data.level), // no fallback value here since it's a required field for pupils
      Schulform: data.schoolType,
      Kontaktperson: data.nameContact,
      'E-Mail Kontaktperson': toStr(data.emailContact),
      'Telefon Kontaktperson': toStr(data.phoneContact),
      'Organisation Kontaktperson': toStr(data.orgContact),
      Online: data.online,
    }
    fields = { ...fields, ...pupilFields }
  } else {
    console.error(`unknown signup type: ${data.type}`)
  }

  // fields not present in local chapter tables
  const globalFields = {
    ...fields,
    Standort: data.chapter[0],
    Spur: window.locations.join(`,\n`),
  }

  const chapterFields = { ...fields, Kontaktpersonen: data.nameContact }

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
