import { test } from '@playwright/test'

test(`debug CSS loading in head section`, async ({ page }) => {
  await page.goto(`/signup-pupil`, { waitUntil: `networkidle` })

  // Wait a bit more for any async loading
  await page.waitForTimeout(2000)

  // Get the head content specifically
  const headContent = await page.locator(`head`).innerHTML()
  console.log(`Head HTML content:`, headContent)

  // Check for theme CSS link
  const themeCssLinks = await page
    .locator(`head link[href*="theme.css"]`)
    .count()
  console.log(`Number of theme CSS links found:`, themeCssLinks)

  if (themeCssLinks > 0) {
    const href = await page
      .locator(`head link[href*="theme.css"]`)
      .first()
      .getAttribute(`href`)
    console.log(`Theme CSS href:`, href)
  }

  // Check for app.css
  const appCssLinks = await page
    .locator(`head link[href*="app.css"], head style`)
    .count()
  console.log(`Number of app CSS links/styles found:`, appCssLinks)

  // Check computed styles of body
  const bodyBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor
  })
  console.log(`Body background color:`, bodyBg)

  // Check if CSS variables are defined
  const cssVarCheck = await page.evaluate(() => {
    const bodyStyles = window.getComputedStyle(document.body)
    return {
      textColor: bodyStyles.getPropertyValue(`--text-color`),
      bodyBg: bodyStyles.getPropertyValue(`--body-bg`),
      lightBlue: bodyStyles.getPropertyValue(`--light-blue`),
    }
  })
  console.log(`CSS variables:`, cssVarCheck)
})
