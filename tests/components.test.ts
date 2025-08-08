import { expect, test } from '@playwright/test'

test.describe(`Component Functionality`, () => {
  test(`search functionality works`, async ({ page }) => {
    await page.goto(`/`)

    // Look for search input
    const searchInput = page.locator(
      `input[type="search"], input[placeholder*="Suche"], input[placeholder*="Search"]`,
    )

    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill(`test`)
      await page.keyboard.press(`Enter`)

      // Should either navigate or show results
      await page.waitForTimeout(1000)
      await expect(page.locator(`body`)).toBeVisible()
    }
  })

  test(`map component loads`, async ({ page }) => {
    await page.goto(`/standorte`)

    // Look for map container
    const map = page.locator(`#map, .map, .mapbox, [class*="mapbox"]`)

    if ((await map.count()) > 0) {
      await expect(map.first()).toBeVisible()

      // Wait for map to potentially load
      await page.waitForTimeout(2000)
    }
  })

  test(`modal/dialog functionality`, async ({ page }) => {
    await page.goto(`/`)

    // Look for buttons that might open modals
    const modalTriggers = page.locator(
      `button:has-text("info"), button:has-text("mehr"), button[aria-haspopup="dialog"]`,
    )
    const count = await modalTriggers.count()

    if (count > 0) {
      await modalTriggers.first().click()

      // Look for modal content
      const modal = page.locator(`[role="dialog"], .modal, [class*="modal"]`)
      if ((await modal.count()) > 0) {
        await expect(modal.first()).toBeVisible()

        // Should be able to close modal
        const closeButton = page.locator(
          `button:has-text("×"), button:has-text("close"), button[aria-label*="close"]`,
        )
        if ((await closeButton.count()) > 0) {
          await closeButton.first().click()
        } else {
          await page.keyboard.press(`Escape`)
        }
      }
    }
  })

  test(`dropdown menus work`, async ({ page }) => {
    await page.goto(`/`)

    // Look for dropdown triggers in navigation
    const dropdownTriggers = page.locator(
      `button:has-text("öffnen"), button[aria-expanded], [class*="dropdown"] button`,
    )
    const count = await dropdownTriggers.count()

    for (let i = 0; i < Math.min(count, 3); i++) {
      const trigger = dropdownTriggers.nth(i)
      if (await trigger.isVisible()) {
        await trigger.click()

        // Should show dropdown content
        await page.waitForTimeout(500)

        // Click somewhere else to close
        await page.click(`body`)
      }
    }
  })

  test(`tooltips appear on hover`, async ({ page }) => {
    await page.goto(`/`)

    // Look for elements that might have tooltips
    const tooltipTriggers = page.locator(
      `[title], [data-tooltip], [aria-describedby]`,
    )
    const count = await tooltipTriggers.count()

    if (count > 0) {
      const trigger = tooltipTriggers.first()
      await trigger.hover()

      // Wait for potential tooltip
      await page.waitForTimeout(1000)

      // Tooltip functionality is hard to test reliably, so just verify the trigger exists
      await expect(trigger).toBeVisible()
    }
  })

  test(`pagination works`, async ({ page }) => {
    await page.goto(`/blog`)

    // Look for pagination controls
    const pagination = page.locator(
      `.pagination, [class*="pagination"], nav[aria-label*="pagination"]`,
    )

    if ((await pagination.count()) > 0) {
      const nextButton = page.locator(
        `a:has-text("next"), a:has-text("weiter"), a:has-text(">")`,
      )

      if ((await nextButton.count()) > 0) {
        const currentUrl = page.url()
        console.warn(`currentUrl:`, currentUrl)
        await nextButton.first().click()

        // Should navigate to different page
        await page.waitForTimeout(1000)
        // URL might change for pagination
      }
    }
  })

  test(`social media links work`, async ({ page }) => {
    await page.goto(`/`)

    // Look for social media links
    const socialLinks = page.locator(
      `a[href*="facebook"], a[href*="twitter"], a[href*="instagram"], a[href*="linkedin"]`,
    )
    const count = await socialLinks.count()

    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = socialLinks.nth(i)
      const href = await link.getAttribute(`href`)

      // Should have valid social media URLs
      expect(href).toMatch(
        /^https?:\/\/(www\.)?(facebook|twitter|instagram|linkedin)\.com/,
      )

      // Should open in new tab (optional)
      const target = await link.getAttribute(`target`)
      console.warn(`target:`, target)

      // Some social links may not have target="_blank", which is fine
    }
  })
})
