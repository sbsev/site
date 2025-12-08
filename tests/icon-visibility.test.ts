import { expect, test } from '@playwright/test'

test('navigation icons are present immediately (no flash)', async ({
  page,
}) => {
  // Go to home page
  await page.goto('/')

  // Check for menu button icon (mobile) or nav icons (desktop) immediately
  // We don't use web assertions that wait (like toBeVisible) because we want to fail if it's not there INSTANTLY.
  // However, Playwright is fast.
  // We'll check the count of SVGs in the nav.

  // Note: On desktop, nav icons are visible. On mobile, the hamburger menu is visible.
  // We'll inspect the DOM state.

  const svgs = page.locator('nav svg, .mobile-menu-btn svg')
  const count = await svgs.count()

  // If dynamic loading is happening, count might be 0 initially.
  // If bundled, they should be in the initial HTML.
  console.log(`Initial SVG count: ${count}`)

  // Should have at least the logo and some icons if desktop, or menu icon if mobile.
  expect(count).toBeGreaterThan(0)

  // Specific check for a known icon, e.g., 'Standorte' -> 'ic:place'
  // If we are on desktop (>1100px), Standorte icon should be there.
  const standorteIcon = page.locator('a[href="/standorte"] svg')
  if ((await page.viewportSize()?.width!) > 1100) {
    expect(await standorteIcon.count()).toBe(1)
  }
})
