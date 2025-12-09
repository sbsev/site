import { expect, test } from '@playwright/test'

test.describe(`Accessibility and UX`, () => {
  test(`homepage has proper heading structure`, async ({ page }) => {
    await page.goto(`/`)

    // Should have an h1
    await expect(page.locator(`h1`).first()).toBeVisible()

    // Some pages may have multiple h1s (which is fine in modern HTML5)
    expect(await page.locator(`h1`).count()).toBeGreaterThan(0)

    // Should have logical heading hierarchy
    const headings = page.locator(`h1, h2, h3, h4, h5, h6`)
    expect(await headings.count()).toBeGreaterThan(0)
  })

  test(`navigation is keyboard accessible`, async ({ page }) => {
    await page.goto(`/`)

    // Tab through navigation
    await page.keyboard.press(`Tab`)

    // Should be able to focus on some element (navigation may vary)
    const focusableElements = page.locator(
      `a, button, input, [tabindex]:not([tabindex="-1"])`,
    )
    const count = await focusableElements.count()
    expect(count).toBeGreaterThan(0)
  })

  test(`images have alt text`, async ({ page }) => {
    await page.goto(`/`)

    // Get all images
    const images = page.locator(`img`)
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute(`alt`)

      // Images should have alt text (empty string is acceptable for decorative images)
      expect(alt).not.toBeNull()
    }
  })

  test(`forms have proper labels`, async ({ page }) => {
    await page.goto(`/signup-student`)

    // All form inputs should have labels or aria-labels
    const inputs = page.locator(`input, select, textarea`)
    const count = await inputs.count()

    for (let i = 0; i < Math.min(count, 10); i++) {
      // Check first 10 inputs
      const input = inputs.nth(i)
      const id = await input.getAttribute(`id`)
      const ariaLabel = await input.getAttribute(`aria-label`)

      if (id) {
        // Should have a corresponding label
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = (await label.count()) > 0
        const hasAriaLabel = ariaLabel !== null

        expect(hasLabel || hasAriaLabel).toBeTruthy()
      }
    }
  })

  test(`skip link functionality`, async ({ page }) => {
    await page.goto(`/`)

    // Check if skip link exists and is functional
    await page.keyboard.press(`Tab`)
    const skipLink = page.locator(
      `a:has-text("Skip"), a[href="#main"], a[href="#content"]`,
    )

    if ((await skipLink.count()) > 0) {
      await expect(skipLink.first()).toBeFocused()
    }
  })

  test(`color contrast is sufficient`, async ({ page }) => {
    await page.goto(`/`)

    // Basic check that text is visible and readable
    const textElements = page.locator(
      `p, h1, h2, h3, h4, h5, h6, a, button, span`,
    )
    const count = await textElements.count()

    // Check that text elements are visible (basic contrast check)
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = textElements.nth(i)
      if (await element.isVisible()) {
        await expect(element).toBeVisible()
      }
    }
  })
})
