import { expect, test } from '@playwright/test'
import { fill_place, fill_select, move_slider } from './helpers.ts'

test(`student signup form can be submitted after filling all required fields`, async ({
  page,
}) => {
  console.log(`Test initialized`)
  console.log(page.url())
  await page.goto(`/signup-student`, { waitUntil: `networkidle` })

  console.log(page.url())

  await fill_select(page, `#chapter`, [`Test`])

  await fill_select(page, `#gender`, [`Weiblich`])

  await page.fill(`#fullName`, `Foo Bar`)

  await page.fill(`#email`, `florian.kleinicke@studenten-bilden-schueler.de`)

  await fill_select(page, `input#subjects`, [`Mathe`, `Physik`])

  // rangeSlider
  await move_slider(page, `.rangeNub`)

  await fill_place(page, `#places input`, `Hamburg`)
  await page.waitForSelector(`input[data-place='1']`)

  await fill_place(page, `#places input`, `Heidelberg`)
  await page.waitForSelector(`input[data-place='2']`)

  await fill_select(page, `#discovery`, [`Freunde`])

  await page.click(`#agreement`)

  await page.click(`#dataProtection`)

  await page.click(`button[type=submit].main`)

  // make sure we get to the success page
  expect(await page.locator(`text=🎉 ⭐ 🎉`).textContent()).toBe(`🎉 ⭐ 🎉`)
})
