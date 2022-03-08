import { expect, test } from 'vitest'
import { fill_multi_select, fill_place_select, move_slider } from './helpers'
import { page } from './puppeteer'

const port = process.env.PORT ?? 3000

test(`pupil signup form can be submitted after filling all required fields`, async () => {
  // needs the dev server running on localhost:3000 to work, fails with
  // Error: net::ERR_CONNECTION_REFUSED otherwise
  await page.goto(`http://localhost:${port}/signup-pupil`, {
    timeout: 15_000,
    waitUntil: `networkidle2`,
  })

  await fill_multi_select(page, `#chapter`, [`Test`])

  await fill_multi_select(page, `#gender`, [`Männlich`])

  await page.type(`#firstName`, `Foo Bar`)

  await fill_multi_select(page, `input[name='subjects']`, [`Mathe`, `Englisch`])

  await fill_multi_select(page, `#schoolTypes`, [`Realschule`])

  await move_slider(page, `.rangeNub`)

  await fill_place_select(page, `#places input`, `Hamburg`)
  await page.waitForSelector(`input[data-place='1']`)

  await fill_place_select(page, `#places input`, `Heidelberg`)
  await page.waitForSelector(`input[data-place='2']`)

  await page.type(`#birthYear`, `2010`)

  await page.click(`#online`)

  await page.type(`#nameContact`, `Baz Bar`)

  await page.type(`#phoneContact`, `012 345 678`)

  await page.type(`#emailContact`, `baz@bar.com`)

  await page.type(`#orgContact`, `Privat`)

  await page.click(`#need`)

  await page.click(`#dataProtection`)

  await page.click(`button[type=submit].main`)

  const span = await page.waitForSelector(`main > section > span:first-child`)

  if (!span) throw new Error(`No success span found`)

  const text = await page.evaluate((el) => el.textContent, span)

  expect(text).toBe(`🎉 ⭐ 🎉`)
})
