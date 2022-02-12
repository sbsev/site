import puppeteer from 'puppeteer'

export async function fillInput(page, id, value) {
  await page.focus(id)
  await page.keyboard.type(value)
}

export async function fillPlaceSelect(page, id, value) {
  await fillInput(page, id, value)
  await page.waitForSelector(`.mapboxgl-ctrl-geocoder--suggestion`)
  await page.keyboard.press(`ArrowDown`)
  await page.keyboard.press(`Enter`)
}

export async function fillMultiSelect(page, id, values) {
  await page.focus(id)
  for (const value of values) {
    await page.keyboard.type(value)
    await page.keyboard.press(`Enter`)
  }
  // close the dropdown after all values are entered
  await page.keyboard.press(`Escape`)
}

// https://stackoverflow.com/a/51884637
export async function completeSlider(page, selector) {
  await page.focus(selector)

  await page.keyboard.press(`ArrowRight`)
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

// taken from https://github.com/avajs/ava/blob/master/docs/recipes/puppeteer.md
// makes Puppeteer page available inside test functions
export async function withPage(t, run) {
  const { browser, page } = await launchPuppeteer({
    headless: false,
    // slowMo: 20,
  })

  try {
    await run(t, page)
  } catch (err) {
    console.error(err)
  } finally {
    await page.close()
    await browser.close()
  }
}
