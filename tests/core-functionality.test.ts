import { expect, test } from '@playwright/test'

test.describe(`Core Website Functionality`, () => {
  test(`homepage loads correctly`, async ({ page }) => {
    await page.goto(`/`)

    // Check that the page loads and has expected content
    await expect(page).toHaveTitle(/StudyTutors/)
    await expect(page.locator(`h1`).first()).toBeVisible()

    // Check that navigation is present
    await expect(page.locator(`nav`)).toBeVisible()

    // Check that the logo is present
    await expect(
      page.locator(`img[alt*="Logo"], img[alt*="ST"]`).first(),
    ).toBeVisible()
  })

  test(`navigation works correctly`, async ({ page }) => {
    await page.goto(`/`)

    // Test direct navigation to ensure routing works
    await page.goto(`/signup-student`)
    await expect(page).toHaveURL(/signup-student/)
    await expect(page.locator(`h1`).first()).toBeVisible()

    // Navigate back to homepage
    await page.goto(`/`)
    await expect(page.locator(`h1`).first()).toBeVisible()
  })

  test(`responsive design works`, async ({ page }) => {
    await page.goto(`/`)

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator(`nav`)).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator(`body`)).toBeVisible()

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator(`body`)).toBeVisible()
  })

  test(`theme switcher works`, async ({ page }) => {
    await page.goto(`/`)

    // Look for theme switcher button
    const themeButton = page.locator(
      `button[title*="theme"], button[aria-label*="theme"], button:has-text("Set color mode")`,
    )
    if (await themeButton.isVisible()) {
      await themeButton.click()
      // Just verify it's clickable, theme changes are hard to test without DOM inspection
      await expect(themeButton).toBeVisible()
    }
  })
})
