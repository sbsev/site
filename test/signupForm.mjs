// https://github.com/avajs/ava/blob/master/docs/recipes/puppeteer.md

import test from 'ava'
import puppeteer from 'puppeteer'

async function withPage(t, run) {
  const browser = await puppeteer.launch({
    headless: true, // set to false to see the test in action
    defaultViewport: null,
  })

  const page = await browser.newPage()

  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

async function fillInput(page, id, value) {
  await page.focus(id)
  await page.keyboard.type(value)
}

async function fillSingleSelect(page, id, value) {
  await fillInput(page, id, value)
  await page.keyboard.press(`Enter`)
}

async function fillMultiSelect(page, id, values) {
  for (const value of values) {
    await page.focus(id)
    await page.keyboard.type(value)
    await page.keyboard.press(`Enter`)
  }
}

test(`signup form accepts minimal student data`, withPage, async (t, page) => {
  await page.goto(`http://localhost:3000/anmeldung?test=true`)

  await fillSingleSelect(page, `#chapter`, `Aachen`)

  await fillSingleSelect(page, `#gender`, `Weiblich`)

  await fillInput(page, `#fullname`, `Foo Bar`)

  await fillInput(page, `#email`, `foo@bar.com`)

  await fillMultiSelect(page, `#subjects`, [`Mathe`, `Physik`])

  await fillInput(page, `#place`, `Bibliothek`)

  await fillSingleSelect(page, `#discovery`, `Freunde`)

  await page.$eval(`#agreement`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())

  await page.$eval(`button[type=submit]`, (el) => el.click())

  const span = await page.waitForSelector(`main > section > span:first-child`)

  const text = await (await span.getProperty(`textContent`)).jsonValue()

  t.is(text, `🎉 ⭐ 🎉`)
})

test(`signup form accepts minimal pupil data`, withPage, async (t, page) => {
  await page.goto(`http://localhost:3000/anmeldung?test=true`)

  await page.$eval(`input[type='radio'][value='Schüler']`, (el) => el.click())

  await page.waitForSelector(`#firstname`) // wait for DOM changes to be applied before proceeding after clicking the pupil button

  await fillSingleSelect(page, `#chapter`, `Heidelberg`)

  await fillSingleSelect(page, `#gender`, `Männlich`)

  await fillInput(page, `#firstname`, `Foo Bar`)

  await fillMultiSelect(page, `#subjects`, [`Mathe`, `Englisch`])

  await fillSingleSelect(page, `#schoolType`, `Realschule`)

  await fillInput(page, `#level`, `7`)

  await fillInput(page, `#place`, `Stadtbücherei`)

  await page.$eval(`#online`, (el) => el.click())

  await fillInput(page, `#nameContact`, `Baz Bar`)

  await fillInput(page, `#phoneContact`, `012 345 678`)

  await fillInput(page, `#emailContact`, `baz@bar.com`)

  await fillInput(page, `#orgContact`, `Privat`)

  await page.$eval(`#need`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())

  await page.$eval(`button[type=submit]`, (el) => el.click())

  const span = await page.waitForSelector(`main > section > span:first-child`)

  const text = await (await span.getProperty(`textContent`)).jsonValue()

  t.is(text, `🎉 ⭐ 🎉`)
})
