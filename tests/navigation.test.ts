import { expect, test } from '@playwright/test'

test.describe(`Navigation`, () => {
  test(`navigating to different pages updates content`, async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })

    // Start at home page
    await page.goto(`/`)
    await page.waitForLoadState(`networkidle`)

    const homeH1 = await page.locator(`h1`).first().textContent()
    console.log(`Home page H1: ${homeH1}`)

    // Navigate to a chapter page by directly visiting the URL
    await page.goto(`/standorte/aachen`)
    await page.waitForLoadState(`networkidle`)

    const aachenH1 = await page.locator(`h1`).first().textContent()
    console.log(`Aachen page H1: ${aachenH1}`)

    // Verify content changed
    expect(aachenH1).not.toBe(homeH1)
    expect(aachenH1).toContain(`Aachen`)

    // Navigate to another chapter page
    await page.goto(`/standorte/augsburg`)
    await page.waitForLoadState(`networkidle`)

    const augsburgH1 = await page.locator(`h1`).first().textContent()
    console.log(`Augsburg page H1: ${augsburgH1}`)

    // Verify content changed from Aachen to Augsburg
    expect(augsburgH1).not.toBe(aachenH1)
    expect(augsburgH1).toContain(`Augsburg`)
  })

  test(`navigation menu contains expected links`, async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto(`/`)

    // Check that main navigation items exist
    const nav = page.locator(`nav.desktop`)
    await expect(nav).toBeVisible()

    // Check for expected menu items
    const standorteLink = nav.locator(`a[href="/standorte"]`)
    await expect(standorteLink).toBeVisible()

    const uberUnsLink = nav.locator(`a[href="/ueber-uns"]`)
    await expect(uberUnsLink).toBeVisible()
  })

  test(`mobile navigation exists on small screens`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`/`)

    // Mobile nav should exist in DOM
    const mobileNav = page.locator(`nav.mobile`)
    await expect(mobileNav).toHaveCount(1)

    // Check that the mobile menu has expected structure
    const navUl = mobileNav.locator(`> ul`)
    await expect(navUl).toHaveCount(1)
  })
})
