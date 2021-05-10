// run tests in this file with `yarn test` while the dev server
// is running (yarn dev) on localhost:3000

import test from 'ava'

import { fillStudentForm } from './helpers/fillStudentForm.mjs'
import { fillPupilForm } from './helpers/fillPupilForm.mjs'
import { launchPuppeteer } from './helpers/index.mjs'

// taken from https://github.com/avajs/ava/blob/master/docs/recipes/puppeteer.md
// makes Puppeteer page available inside test functions
async function withPage(t, run) {
  const { browser, page } = await launchPuppeteer({
    headless: true,
    // slowMo: 20,
  })

  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test(`signup form accepts minimal student data`, withPage, async (t, page) => {
  // needs the dev server running on localhost:3000 to work, fails with
  // Error: net::ERR_CONNECTION_REFUSED otherwise
  await page.goto(`http://localhost:3000/anmeldung?test=true`)

  await fillStudentForm(page)

  await page.$eval(`button[type=submit].main`, (el) => el.click())

  const span = await page.waitForSelector(`main > section > span:first-child`)

  const text = await (await span.getProperty(`textContent`)).jsonValue()

  t.is(text, `🎉 ⭐ 🎉`)
})

test(`signup form accepts minimal pupil data`, withPage, async (t, page) => {
  // needs the dev server running on localhost:3000 to work, fails with
  // Error: net::ERR_CONNECTION_REFUSED otherwise
  await page.goto(`http://localhost:3000/anmeldung?test=true`)

  await fillPupilForm(page)

  await page.$eval(`button[type=submit].main`, (el) => el.click())

  const span = await page.waitForSelector(`main > section > span:first-child`)

  const text = await (await span.getProperty(`textContent`)).jsonValue()

  t.is(text, `🎉 ⭐ 🎉`)
})
