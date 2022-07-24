import type { Browser, Page } from 'playwright'
import * as playwright from 'playwright'
import { afterAll, beforeAll } from 'vitest'

export let browser: Browser
export let page: Page
// make sure tests try to access localhost on the same port the dev server is running on (defaults to 3000)
export const port = process.env.PORT ?? 3000

const browser_name = (process.env.BROWSER ?? `chromium`) as
  | 'chromium'
  | 'firefox'
  | 'webkit'

const local_args = {
  headless: false,
  slowMo: 40,
}

// GitHub action and many other continuous integration runners set CI to 'true'
const launch_args = process.env.CI ? {} : local_args

beforeAll(async () => {
  browser = await playwright[browser_name].launch(launch_args)
  page = await browser.newPage()
})

afterAll(async () => {
  await browser.close()
})
export async function fill_select(
  page: Page,
  selector: string,
  values: string[]
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
