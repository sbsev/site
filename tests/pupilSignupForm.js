import test from 'ava'
import {
  completeSlider,
  fillInput,
  fillMultiSelect,
  fillPlaceSelect,
  launchPuppeteer,
  withPage,
} from './_helpers.js'

async function fillPupilForm(page) {
  await page.waitForSelector(`#firstName`) // wait for DOM changes to be applied before proceeding after clicking the pupil button

  await fillMultiSelect(page, `#chapter`, `Test`)

  await fillMultiSelect(page, `#gender`, `Männlich`)

  await fillInput(page, `#firstName`, `Foo Bar`)

  await fillMultiSelect(page, `[name='subjects']`, [`Mathe`, `Englisch`])

  await fillMultiSelect(page, `#schoolTypes`, `Realschule`)

  await completeSlider(page, `.rangeNub`)

  await fillPlaceSelect(page, `[name='places'] input`, `test1`)
  await page.waitForSelector(`input[data-place='1']`)

  await fillPlaceSelect(page, `[name='places'] input`, `test2`)
  await page.waitForSelector(`input[data-place='2']`)

  await page.$eval(`#online`, (el) => el.click())

  await fillInput(page, `#nameContact`, `Baz Bar`)

  await fillInput(page, `#phoneContact`, `012 345 678`)

  await fillInput(page, `#emailContact`, `baz@bar.com`)

  await fillInput(page, `#orgContact`, `Privat`)

  await page.$eval(`#need`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())
}

test(
  `pupil signup form can be submitted after filling all required fields`,
  withPage,
  async (t, page) => {
    // needs the dev server running on localhost:3000 to work, fails with
    // Error: net::ERR_CONNECTION_REFUSED otherwise
    await page.goto(`http://localhost:3000/signup-pupil`, {
      timeout: 4000,
      waitUntil: `networkidle2`,
    })

    await fillPupilForm(page)

    await page.$eval(`button[type=submit].main`, (el) => el.click())

    const span = await page.waitForSelector(`main > section > span:first-child`)

    const text = await (await span.getProperty(`textContent`)).jsonValue()

    t.is(text, `🎉 ⭐ 🎉`)
  }
)

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly via
  // `node test/helpers/fillPupilForm.js`
  // Useful when manually testing form submissions. Needs dev server running on localhost:3000
  // (fails with Error: net::ERR_CONNECTION_REFUSED otherwise). Will automatically fill out
  // every required field in the pupil form allowing for immediate manual form submission afterwards.

  const { page } = await launchPuppeteer({ headless: false, slowMo: 10 })

  await page.goto(`http://localhost:3000/signup-pupil`)

  fillPupilForm(page)
}
