import { expect, test } from '@playwright/test'
import { fill_place, fill_select, move_slider } from './helpers.ts'

test(`student signup form can be submitted after filling all required fields`, async ({
  page,
}) => {
  await page.goto(`/signup-student`, { waitUntil: `networkidle` })

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

  await page.click(`button[type=submit].main`, {
    timeout: 10000,
  })

  await page.waitForNavigation({ timeout: 10000 })

  // make sure we get to the success page
  expect(
    await page.locator(`text=🎉 ⭐ 🎉`, { timeout: 10000 }).textContent(),
  ).toBe(`🎉 ⭐ 🎉`)
})
