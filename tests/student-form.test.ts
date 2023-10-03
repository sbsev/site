import { expect, test } from '@playwright/test'
import { fill_place, fill_select, move_slider } from './helpers.ts'

test(`student signup form can be submitted after filling all required fields`, async ({
  page,
}) => {
  await page.goto(`/signup-student`, { waitUntil: `networkidle` })

  console.log(`Page visited`)

  await fill_select(page, `#chapter`, [`Test`])

  console.log(`Chapter selected`)

  await fill_select(page, `#gender`, [`Weiblich`])

  console.log(`Gender selected`)

  await page.fill(`#fullName`, `Foo Bar`)

  console.log(`Full name entered`)

  await page.fill(`#email`, `florian.kleinicke@studenten-bilden-schueler.de`)

  console.log(`Email filled in`)

  await fill_select(page, `input#subjects`, [`Mathe`, `Physik`])

  console.log(`Subjects selected`)

  // rangeSlider
  await move_slider(page, `.rangeNub`)

  console.log(`Slider moved`)

  await fill_place(page, `#places input`, `Hamburg`)
  await page.waitForSelector(`input[data-place='1']`)

  console.log(`Place selected`)

  // await fill_place(page, `#places input`, `Heidelberg`)
  // await page.waitForSelector(`input[data-place='2']`)

  await fill_select(page, `#discovery`, [`Freunde`])

  console.log(`Discovery`)

  await page.click(`#agreement`)

  console.log(`Agreement`)

  await page.click(`#dataProtection`)

  console.log(`Dataprocs`)

  await page.click(`button[type=submit].main`)

  console.log(`Button clicked`)

  console.log(await page.content())

  // make sure we get to the success page
  expect(await page.locator(`text=🎉 ⭐ 🎉`).textContent()).toBe(`🎉 ⭐ 🎉`)

  console.log(await page.content())
})
