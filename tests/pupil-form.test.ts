import { expect, test } from '@playwright/test'
import { fill_place, fill_select, move_slider } from './helpers.ts'

test(`pupil signup form can be submitted after filling all required fields`, async ({
  page,
}) => {
  await page.goto(`/signup-pupil`, { waitUntil: `networkidle` })

  await fill_select(page, `#chapter`, [`Test`])

  await fill_select(page, `#gender`, [`Männlich`])

  await page.fill(`#firstName`, `Foo Bar`)

  await fill_select(page, `input#subjects`, [`Mathe`, `Englisch`])

  await fill_select(page, `#schoolTypes`, [`Realschule`])

  await move_slider(page, `.rangeNub`)

  await fill_place(page, `#places input`, `Hamburg`)
  await page.waitForSelector(`input[data-place='1']`)

  await fill_place(page, `#places input`, `Heidelberg`)
  await page.waitForSelector(`input[data-place='2']`)

  await page.fill(`#birthYear`, `2010`)

  await page.click(`#online`)

  await page.fill(`#nameContact`, `Baz Bar`)

  await page.fill(`#phoneContact`, `012 345 678`)

  await page.fill(
    `#emailContact`,
    `florian.kleinicke@studenten-bilden-schueler.de`,
  )

  await page.fill(`#orgContact`, `Privat`)

  await page.click(`#need`)

  await page.click(`#dataProtection`)

  await page.click(`button[type=submit].main`, {
    timeout: 10000,
  })

  await page.waitForNavigation({ timeout: 20000 })

  // make sure we get to the success page
  expect(
    await page.locator(`text=🎉 ⭐ 🎉`, { timeout: 10000 }).textContent(),
  ).toBe(`🎉 ⭐ 🎉`)
})


test.run({
  timeout: 45000
})