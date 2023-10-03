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


  await fill_select(page, `#discovery`, [`Freunde`])

  await page.click(`#agreement`)

  await page.click(`#dataProtection`)

  await page.click(`button[type=submit].main`)

  await page.screenshot({ path: `screenshot.png` })

  // console.log(await page.content())


  await page.waitForSelector(`span:has-text("🎉 ⭐ 🎉")`)

  console.log("has txt")

  // const spanText = await page.$eval(
  //   `span:has-text("🎉 ⭐ 🎉")`,
  //   (element) => element.textContent,
  // )

  // expect(spanText).toContain(`🎉 ⭐ 🎉`)

  // await page.close()
})
