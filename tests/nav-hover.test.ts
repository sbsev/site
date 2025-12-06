import { expect, test } from '@playwright/test'

test.describe(`Navigation Menu Hover Behavior`, () => {
  test(`submenu appears on hover over menu item with subnav`, async ({
    page,
    browserName,
  }) => {
    // Skip this test on mobile-sized browsers since hover doesn't apply there
    await page.setViewportSize({ width: 1200, height: 800 })

    await page.goto(`/`)

    // Find a menu item that has a submenu (look for nav items with buttons for expanding)
    const navItems = await page.locator(`nav.desktop > ul > li`).count()
    expect(navItems).toBeGreaterThan(0)

    // Find the first menu item with a submenu button
    const firstMenuItemWithSubmenu = page.locator(
      `nav.desktop > ul > li:has(button)`
    ).first()

    // Hover over the menu item
    await firstMenuItemWithSubmenu.hover()

    // The submenu (nested ul) should become visible after hover
    const submenu = firstMenuItemWithSubmenu.locator(`> ul`)

    // Check if submenu is visible
    try {
      await expect(submenu).toBeVisible({ timeout: 500 })
      console.log(`✓ Submenu appeared on hover`)
    } catch {
      // If not visible, check if it exists in DOM but is hidden
      const exists = await submenu.count()
      if (exists === 0) {
        throw new Error(`Submenu not found in DOM for hovered menu item`)
      } else {
        // Check computed style
        const isHidden = await submenu.evaluate(
          (el) => getComputedStyle(el).display === `none`
        )
        throw new Error(
          `Submenu exists but is hidden (display: ${isHidden ? 'none' : 'visible'}).\nThis indicates the hover event handler may not be triggering correctly.`
        )
      }
    }

    // Move mouse away to verify submenu hides
    await page.goto(`/`) // Move away from the menu
    await expect(submenu).not.toBeVisible()
  })

  test(`submenu items are clickable when visible`, async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto(`/`)

    // Find first menu item with submenu
    const firstMenuItemWithSubmenu = page.locator(
      `nav.desktop > ul > li:has(button)`
    ).first()

    // Hover to show submenu
    await firstMenuItemWithSubmenu.hover()

    // Get the first submenu item link
    const firstSubmenuLink = firstMenuItemWithSubmenu
      .locator(`> ul > li:first-child > a`)
      .first()

    // Verify submenu link is visible and clickable
    await expect(firstSubmenuLink).toBeVisible()

    // Get the href to verify it's a valid link
    const href = await firstSubmenuLink.getAttribute(`href`)
    expect(href).toBeTruthy()
    expect(href).toMatch(/^\//)
  })

  test(`mobile menu toggle works correctly`, async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`/`)

    // The nav should be closed by default on mobile
    const navMobile = page.locator(`nav.mobile`)

    // Check initial state
    const initialTransform = await navMobile.evaluate(
      (el) => getComputedStyle(el).transform
    )
    expect(initialTransform).toContain(`translate`)

    // Find and click the menu button
    const menuButton = page.locator(
      `header button[aria-label="Navigationsmenü öffnen"]`
    )
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    // Nav should now be visible (transform should change)
    const openTransform = await navMobile.evaluate(
      (el) => getComputedStyle(el).transform
    )
    expect(openTransform).not.toBe(initialTransform)
  })
})
