import type { Page } from '@playwright/test'

export async function fill_select(
  page: Page,
  selector: string,
  values: string[],
) {
  for (const value of values) {
    await page.fill(selector, value)
    await page.keyboard.press(`ArrowDown`)
    await page.keyboard.press(`Enter`)
  }
  // close the dropdown after all values are entered
  await page.keyboard.press(`Escape`)
}

export async function fill_place(page: Page, selector: string, value: string) {
  await page.type(selector, value)
  await page.waitForSelector(`.mapboxgl-ctrl-geocoder--suggestion`)
  await page.keyboard.press(`ArrowDown`)
  await page.keyboard.press(`Enter`)
}

// https://stackoverflow.com/a/51884637
export async function move_slider(page: Page, selector: string) {
  await page.focus(selector)

  await page.keyboard.press(`ArrowRight`)
}
