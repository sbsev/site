import puppeteer from 'puppeteer'

export async function fillInput(page, id, value) {
  await page.focus(id)
  await page.keyboard.type(value)
}

export async function fillPlaceSelect(page, id, value) {
  await fillInput(page, id, value)
  await page.waitForSelector(`.pac-item`)
  await page.keyboard.press(`ArrowDown`)
  await page.keyboard.press(`Enter`)
}

export async function fillSingleSelect(page, id, value) {
  await fillInput(page, id, value)
  await page.keyboard.press(`Enter`)
}

export async function fillMultiSelect(page, id, values) {
  await page.focus(id)
  for (const value of values) {
    await page.keyboard.type(value)
    await page.keyboard.press(`Enter`)
  }
}

// https://stackoverflow.com/a/51884637
export async function completeSlider(page, selector, delteX = 10) {
  const rangeNub = await page.$(selector)

  const { x, y, width, height } = await rangeNub.boundingBox()

  await page.mouse.move(x + width / 2, y + height / 2)
  await page.mouse.down()
  await page.mouse.move(delteX, 0)
  await page.mouse.up()
}

export async function launchPuppeteer({ headless = true, slowMo = 0 }) {
  const browser = await puppeteer.launch({
    headless, // don't set headless to false in CI as action runner has no UI, will fail the test
    defaultViewport: null,
    slowMo, // slow down mouse and keyboard to help see what's going on (good in combination with headless: false)
  })

  const page = (await browser.pages())[0]

  return { browser, page }
}
