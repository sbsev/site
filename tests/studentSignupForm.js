import test from 'ava'
import {
  completeSlider,
  fillInput,
  fillMultiSelect,
  fillPlaceSelect,
  launchPuppeteer,
  withPage,
} from './_helpers.js'

export async function fillStudentForm(page) {
  await fillMultiSelect(page, `#chapter`, `Test`)

  await fillMultiSelect(page, `#gender`, `Weiblich`)

  await fillInput(page, `#fullName`, `Foo Bar`)

  await fillInput(page, `#email`, `foo@bar.com`)

  await fillMultiSelect(page, `div[name='subjects']`, [`Mathe`, `Physik`])

  // rangeSlider
  await completeSlider(page, `.rangeNub`)

  await fillPlaceSelect(page, `div[name='places'] input`, `Hamburg`)
  await page.waitForSelector(`input[data-place='1']`)

  await fillPlaceSelect(page, `div[name='places'] input`, `Heidelberg`)
  await page.waitForSelector(`input[data-place='2']`)

  await fillMultiSelect(page, `#discovery`, `Freunde`)

  await page.$eval(`#agreement`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())

  await page.$eval(`button[type=submit].main`, (el) => el.click())
}

test(
  `student signup form can be submitted after filling all required fields`,
  withPage,
  async (t, page) => {
    // needs the dev server running on localhost:3000 to work, fails with
    // Error: net::ERR_CONNECTION_REFUSED otherwise
    await page.goto(`http://localhost:3000/signup-student`, {
      timeout: 4000,
      waitUntil: `networkidle2`,
    })

    await fillStudentForm(page)

    await page.$eval(`button[type=submit].main`, (el) => el.click())

    const span = await page.waitForSelector(`main > section > span:first-child`)

    const text = await (await span.getProperty(`textContent`)).jsonValue()

    t.is(text, `🎉 ⭐ 🎉`)
  }
)

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly via
  // `node test/helpers/fillStudentForm.js`
  // Useful when manually testing form submissions. Needs dev server running on localhost:3000
  // (fails with Error: net::ERR_CONNECTION_REFUSED otherwise). Will automatically fill out
  // every required field in the student form allowing for immediate manual form submission afterwards.

  const { page } = await launchPuppeteer({ headless: false, slowMo: 10 })

  await page.goto(`http://localhost:3000/signup-student`)

  fillStudentForm(page)
}
