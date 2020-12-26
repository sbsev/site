const baseKeys = {
  Aachen: `app7bKg37AOuJxUL6`,
  Augsburg: `appL5sE9Nv6g2Bvwi`,
  Berlin: `app2XmeYSS23un46c`,
  Braunschweig: `appfkMaKkxtfhgoFN`,
  Bochum: `appSSVbovq62cRtBz`,
  Bonn: `appu8rLNMCMQbRfGZ`,
  Dortmund: `appgRjlgdhqHbuK5e`,
  Dresden: `app7dIHYA52fgt1UE`,
  Düsseldorf: `appcCAPp2v2KpkImb`,
  Erlangen: `appssgyr5VLk7j8cC`,
  Frankfurt: `app91JosD3VOLx6Zf`,
  Gießen: `appgAz8nr4imPrSs1`,
  Göttingen: `appalZhrO48J6VxtL`,
  Halle: `appDpKNafVbi0MhrW`,
  Hannover: `appgPb25g2UqDU6sR`,
  Heidelberg: `appVMNk0ktlkuWD7v`,
  Jena: `app4lGuHnGOEXZHyX`,
  Kassel: `appNd4pmLz26Y1gzd`,
  Landau: `appeA0rkrjxQASdwF`,
  Leipzig: `appUt7OqJpBmzk3mZ`,
  Mannheim: `appoEUP5lB5k3NvsE`,
  Magdeburg: `appUzocAnObKmh6HB`,
  München: `appmdjwGYapIpgpa5`,
  Münster: `app66aCXAIfspPMat`,
  Nürnberg: `appiH1JCqNIHXG6Tq`,
  Regensburg: `appsCpO9rF6AbZg6m`,
  Rostock: `appeRhxIIJgmVzfhT`,
  Trier: `appW8hfve377A1pn2`,
  Schrobenhausen: `appR8wTJmlfaRxMt3`,
  Stuttgart: `app4d0ApJsj1zwWic`,
  Wolfenbüttel: `appATP5jRtIdznBeo`,
  Würzburg: `appvevqhXcnnutvlh`,
  Zwickau: `appaeFSKNXPuVDZKl`,
  keiner: `appakVOq5hTmLQ5e7`,
}

module.exports = function (migration) {
  const chapter = migration.editContentType(`chapter`)
  chapter
    .createField(`baseId`)
    .name(`Airtable Base ID`)
    .type(`Symbol`)
    .required(true)
    .description(
      `The ID of this chapter's Airtable base. Required to send data from the signup form to the correct table.`
    )

  migration.transformEntries({
    contentType: `chapter`,
    from: [`title`],
    to: [`baseId`],
    transformEntryForLocale: function (fromFields, currentLocale) {
      if (!fromFields.title[currentLocale]) return
      if (!baseKeys[fromFields.title[currentLocale]]) {
        console.log(`title:`, currentLocale, fromFields.title[currentLocale])
      }
      return { baseId: baseKeys[fromFields.title[currentLocale]] }
    },
  })
}

// run this file with `contentful space migration ./src/utils/ctf-cli.js`

// gqlFetch

//     const { standorte } = await gqlFetch(
//       `https://api.baseql.com/airtable/graphql/appX9a7ySunOiUZhs`,
//       `{
//         standorte(zustand: "aktiv") {
//           standort
//         }
//       }`
//     )
