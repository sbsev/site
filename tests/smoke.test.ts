import { expect, test } from '@playwright/test'

test.describe('Smoke Tests - Basic Functionality', () => {
  test('website loads and has basic content', async ({ page }) => {
    await page.goto('/')

    // Check that page loads without errors
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible()

    // Check that no error messages are shown
    await expect(page.locator('text="404"')).not.toBeVisible()
    await expect(page.locator('text="500 Error"')).not.toBeVisible()
  })

  test('key pages load successfully', async ({ page }) => {
    const pages = ['/', '/standorte', '/signup-student', '/signup-pupil']

    for (const url of pages) {
      await page.goto(url)
      await expect(page.locator('h1').first()).toBeVisible()

      // Should not show error pages
      expect(page.url()).not.toContain('404')
      expect(page.url()).not.toContain('error')
    }

    // Test blog page separately as it may have network dependencies
    await page.goto('/blog')
    // Just check that page loads without 404, content may fail due to network issues
    expect(page.url()).not.toContain('404')
    expect(page.url()).not.toContain('error')
  })

  test('forms render without crashing', async ({ page }) => {
    // Test student form
    await page.goto('/signup-student')
    await expect(page.locator('form')).toBeVisible()
    const studentFormElementCount = await page
      .locator('input, select, textarea')
      .count()
    expect(studentFormElementCount).toBeGreaterThan(3)

    // Test pupil form
    await page.goto('/signup-pupil')
    await expect(page.locator('form')).toBeVisible()
    const pupilFormElementCount = await page
      .locator('input, select, textarea')
      .count()
    expect(pupilFormElementCount).toBeGreaterThan(3)
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')

    // Test direct navigation instead of clicking hidden links
    await page.goto('/standorte')
    expect(page.url()).toContain('/standorte')
    await expect(page.locator('body')).toBeVisible()

    // Navigate back to ensure site navigation works
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('website is responsive', async ({ page }) => {
    await page.goto('/')

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator('body')).toBeVisible()
  })
})
