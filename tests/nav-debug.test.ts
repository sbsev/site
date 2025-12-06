import { expect, test } from '@playwright/test'

test(`Debug navigation hover - check state and DOM after $state fix`, async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })

  // Inject logging before navigation
  await page.addInitScript(() => {
    ;(window as any).stateChanges = []
  })

  await page.goto(`/`)

  // Find first menu item with submenu
  const firstMenuItemWithSubmenu = page.locator(
    `nav.desktop > ul > li:has(button)`
  ).first()

  console.log(`Found menu item with submenu`)

  // Check if submenu exists before hover
  const submenu = firstMenuItemWithSubmenu.locator(`> ul`)
  const submenuCountBefore = await submenu.count()
  console.log(`Submenu element count before hover: ${submenuCountBefore}`)

  // Get the index by counting
  const allMenuItems = await page.locator('nav.desktop > ul > li').count()
  console.log(`Total menu items: ${allMenuItems}`)

  // Now hover
  console.log(`Hovering over first menu item...`)
  await firstMenuItemWithSubmenu.hover()

  // Wait for state updates
  await page.waitForTimeout(1000)

  // Check again
  const submenuCountAfter = await submenu.count()
  console.log(`Submenu element count after hover: ${submenuCountAfter}`)

  if (submenuCountAfter > 0) {
    const visible = await submenu.isVisible()
    console.log(`Submenu visible: ${visible}`)

    const styles = await submenu.evaluate((el) => {
      const cs = getComputedStyle(el)
      return {
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        position: cs.position,
      }
    })
    console.log(`Submenu styles:`, styles)
  } else {
    console.log(`ERROR: Submenu not in DOM after hover!`)

    // Check the full HTML of the parent li
    const liHTML = await firstMenuItemWithSubmenu.evaluate((el) => el.outerHTML)
    console.log(`Full LI HTML (truncated): ${liHTML.substring(0, 500)}`)
  }
})
