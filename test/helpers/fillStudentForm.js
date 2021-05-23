import {
  launchPuppeteer,
  fillInput,
  fillPlaceSelect,
  fillSingleSelect,
  fillMultiSelect,
  completeSlider,
} from './index.js'

export async function fillStudentForm(page) {
  await fillSingleSelect(page, `#chapter`, `Aachen`)

  await fillSingleSelect(page, `#gender`, `Weiblich`)

  await fillInput(page, `#fullname`, `Foo Bar`)

  await fillInput(page, `#email`, `foo@bar.com`)

  await fillMultiSelect(page, `#subjects`, [`Mathe`, `Physik`])

  await completeSlider(page, `.rangeNub`)

  await fillPlaceSelect(page, `#places`, `test1`)
  await page.waitForSelector(`input[data-place='1']`)

  await fillPlaceSelect(page, `#places`, `test2`)
  await page.waitForSelector(`input[data-place='2']`)

  await fillSingleSelect(page, `#discovery`, `Freunde`)

  await page.$eval(`#agreement`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())

  await page.$eval(`button[type=submit].main`, (el) => el.click())
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly via
  // `node test/helpers/fillStudentForm.js`
  // Useful when manually testing form submissions. Needs dev server running on localhost:3000
  // (fails with Error: net::ERR_CONNECTION_REFUSED otherwise). Will automatically fill out
  // every required field in the student form allowing for immediate manual form submission afterwards.

  const { page } = await launchPuppeteer({ headless: false, slowMo: 10 })

  await page.goto(`http://localhost:3000/anmeldung?test=true`)

  fillStudentForm(page)
}
