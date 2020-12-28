function airtablePost(baseId, table, data, apiKey) {
  fetch(`https://api.airtable.com/v0/${baseId}/${table}`, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ records: data, typecast: true }),
  })
}

const globalBaseId = `appSswal9DNdJKRB8`
const testBaseId = `appe3hVONuwBkuQv1`
let runTest = true

export async function handleSubmit(chapterBaseId, data, apiKey) {
  console.log(`data:`, data)
  const table = data.type === `Student` ? `Studenten` : `Schüler`
  // const table = `Studenten`
  if (data.age) {
    // convert pupil age to approximate birthday (assuming today's day and month)
    const date = new Date()
    date.setFullYear(date.getFullYear() - data.age)
    data.birthDate = date
  }
  const fields = {
    'Vor- und Nachname': data.fullname, // for students
    Vorname: data.firstname, // for pupils
    Telefon: data.phone, // for students
    'E-Mail': data.email,
    Bemerkung: data.remarks,
    'Geografische Präferenz': data.place,
    Klassenstufen: data.levels, // for students
    Klassenstufe: data.level, // for pupils
    Fächer: data.subjects,
    Schulform: data.schoolTypes, // for pupils
    Werbemaßnahme: data.discovery,
    Geschlecht: data.gender,
    'Semester Anmeldung': Number(data.semester) || undefined, // for students
    // pass undefined in case Number(data.semester) is NaN
    Studienfach: data.studySubject, // for students
    Geburtsort: data.birthPlace, // for students
    // Manual conversion of date string into iso format (yyyy-mm-dd). Only necessary
    // in Safari. Should do nothing in other browsers.
    Geburtsdatum:
      typeof data.birthDate === `string`
        ? data.birthDate.split(`.`).reverse().join(`-`)
        : data.birthDate,
    Datenschutz: data.dataProtection,
    Kontaktperson: data.nameContact, // for pupils
    'E-Mail Kontaktperson': data.emailContact, // for pupils
    'Telefon Kontaktperson': data.phoneContact, // for pupils
    'Organisation Kontaktperson': data.orgContact, // for pupils
    Quelle: `landing: ${location.origin}${window.locations[1]}, prev: ${window.locations[0]}`, // analytics
  }
  // Certain chapters organize contact persons a bit different to others
  if (data.chapter === `Halle` && table === `Schüler`) {
    fields.Kontaktperson = `${data.nameContact}; ${data.orgContact}; ${data.emailContact}; ${data.phoneContact}`
    fields[`E-Mail Kontaktperson`] = undefined
    fields[`Telefon Kontaktperson`] = undefined
    fields[`Organisation Kontaktperson`] = undefined
  }
  try {
    const source = `test`
    // [`source`, `chapter`, `type`]
    //   .map((key) => `${key}: ${urlParams.get(key)}`)
    //   .join(`, `)

    // fields not present in individual chapter tables
    const globalFields = {
      Standort: data.chapter,
      Spur: window.locations.join(`,\n`),
      // Quelle: `landing: ${location.origin}${window.locations[1]}, prev: ${document.referrer}, ${source}`,
      // Spur: `test2`, // window.locations.join(`,\n`),
    }

    const globalSubmit = [
      {
        fields: { ...fields, ...globalFields },
      },
    ]

    const townSubmit = [
      {
        fields: { ...fields, Kontaktpersonen: data.nameContact },
      },
    ]

    // use Promise.all to fail fast if one record creation fails

    if (runTest) {
      await Promise.all([airtablePost(testBaseId, table, townSubmit, apiKey)])
    } else {
      await Promise.all([
        // airtablePost(globalBaseId, table, globalSubmit, apiKey), //reactivate after testing
        airtablePost(chapterBaseId, table, townSubmit, apiKey),
        //   globalTable.create([{ fields: { ...fields, ...globalFields } }], {
        //     typecast: true,
        //   }),
        //   // Create new link to Kontaktpersonen table
        //   chapterTable.create(
        //     [{ fields: { ...fields, Kontaktpersonen: data.nameContact } }],
        //     { typecast: true }
        //   ),
      ])
    }
    // alert(snippets.success)
    // // Reset form fields and localStorage.
    // setStoredData({})
    // rhf.reset(null)
    // // Second reset needed to clear controlled react-select fields.
    // rhf.reset({
    //   chapter: ``,
    //   subjects: ``,
    //   schoolTypes: ``,
    //   schoolType: null,
    //   discovery: null,
    // })
  } catch (err) {
    console.error(`Forms error`, err)
    // alert(snippets.error + `\n\n` + JSON.stringify(err, null, 4))
  }
}
