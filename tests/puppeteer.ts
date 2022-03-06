import puppeteer, { Browser, Page } from 'puppeteer'
import { afterAll, beforeAll } from 'vitest'

export let browser: Browser
export let page: Page

const local_args = {
  headless: false,
  defaultViewport: null,
  slowMo: 40,
}

// GitHub action and many other continuous integration runners set CI to 'true'
const launch_args = process.env.CI ? {} : local_args

beforeAll(async () => {
  browser = await puppeteer.launch(launch_args)
  page = await browser.newPage()
})

afterAll(async () => {
  await browser.close()
})
