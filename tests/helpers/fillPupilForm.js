import {
  completeSlider,
  fillInput,
  fillMultiSelect,
  fillPlaceSelect,
  fillSingleSelect,
  launchPuppeteer,
} from './index.js'

export async function fillPupilForm(page) {
  await page.$eval(`input[type='radio'][value='Schüler']`, (el) => el.click())

  await page.waitForSelector(`#firstName`) // wait for DOM changes to be applied before proceeding after clicking the pupil button

  await fillSingleSelect(page, `#chapter`, `Heidelberg`)

  await fillSingleSelect(page, `#gender`, `Männlich`)

  await fillInput(page, `#firstName`, `Foo Bar`)

  await fillMultiSelect(page, `#subjects`, [`Mathe`, `Englisch`])

  await fillSingleSelect(page, `#schoolType`, `Realschule`)

  await fillInput(page, `#level`, `7`)

  await completeSlider(page, `.rangeNub`)

  await fillPlaceSelect(page, `#places`, `test1`)
  await page.waitForSelector(`input[data-place='1']`)

  await fillPlaceSelect(page, `#places`, `test2`)
  await page.waitForSelector(`input[data-place='2']`)

  await page.$eval(`#online`, (el) => el.click())

  await fillInput(page, `#nameContact`, `Baz Bar`)

  await fillInput(page, `#phoneContact`, `012 345 678`)

  await fillInput(page, `#emailContact`, `baz@bar.com`)

  await fillInput(page, `#orgContact`, `Privat`)

  await page.$eval(`#need`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly via
  // `node test/helpers/fillPupilForm.js`
  // Useful when manually testing form submissions. Needs dev server running on localhost:3000
  // (fails with Error: net::ERR_CONNECTION_REFUSED otherwise). Will automatically fill out
  // every required field in the pupil form allowing for immediate manual form submission afterwards.

  const { page } = await launchPuppeteer({ headless: false, slowMo: 10 })

  await page.goto(`http://localhost:3000/anmeldung-schueler`)

  fillPupilForm(page)
}
