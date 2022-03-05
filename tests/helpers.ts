import type { Page } from 'puppeteer'

export async function fill_input(page: Page, selector: string, value: string) {
  await page.focus(selector)
  await page.keyboard.type(value)
}

export async function fill_place_select(
  page: Page,
  selector: string,
  value: string
) {
  await fill_input(page, selector, value)
  await page.waitForSelector(`.mapboxgl-ctrl-geocoder--suggestion`)
  await page.keyboard.press(`ArrowDown`)
  await page.keyboard.press(`Enter`)
}

export async function fill_multi_select(
  page: Page,
  selector: string,
  values: string[]
) {
  await page.focus(selector)
  for (const value of values) {
    await page.keyboard.type(value)
    await page.keyboard.press(`ArrowDown`)
    await page.keyboard.press(`Enter`)
  }
  // close the dropdown after all values are entered
  await page.keyboard.press(`Escape`)
}

// https://stackoverflow.com/a/51884637
export async function move_slider(page: Page, selector: string) {
  await page.focus(selector)

  await page.keyboard.press(`ArrowRight`)
}
