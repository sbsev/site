import { expect, test } from 'vitest'
import {
  fill_input,
  fill_multi_select,
  fill_place_select,
  move_slider,
} from './helpers'
import { page } from './puppeteer'

test(`student signup form can be submitted after filling all required fields`, async () => {
  // needs the dev server running on localhost:3000 to work, fails with
  // Error: net::ERR_CONNECTION_REFUSED otherwise
  await page.goto(`http://localhost:3000/signup-student`, {
    timeout: 15_000,
    waitUntil: `networkidle2`,
  })

  await fill_multi_select(page, `#chapter`, [`Test`])

  await fill_multi_select(page, `#gender`, [`Weiblich`])

  await fill_input(page, `#fullName`, `Foo Bar`)

  await fill_input(page, `#email`, `foo@bar.com`)

  await fill_multi_select(page, `input[name='subjects']`, [`Mathe`, `Physik`])

  // rangeSlider
  await move_slider(page, `.rangeNub`)

  await fill_place_select(page, `div[name='places'] input`, `Hamburg`)
  await page.waitForSelector(`input[data-place='1']`)

  await fill_place_select(page, `div[name='places'] input`, `Heidelberg`)
  await page.waitForSelector(`input[data-place='2']`)

  await fill_multi_select(page, `#discovery`, [`Freunde`])

  await page.$eval(`#agreement`, (el) => el.click())

  await page.$eval(`#dataProtection`, (el) => el.click())

  await page.$eval(`button[type=submit].main`, (el) => el.click())

  await page.$eval(`button[type=submit].main`, (el: Element) => el.click())

  const span = await page.waitForSelector(`main > section > span:first-child`)

  if (!span) throw new Error(`No success span found`)

  const text = await (await span.getProperty(`textContent`)).jsonValue()

  expect(text).toBe(`🎉 ⭐ 🎉`)
})
