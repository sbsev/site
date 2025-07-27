import { expect, test } from '@playwright/test'

test.describe('Page Loading and Content', () => {
  const pages = [
    { url: '/', title: 'Homepage' },
    { url: '/standorte', title: 'Standorte' },
    { url: '/blog', title: 'Blog' },
    { url: '/signup-student', title: 'Student Signup' },
    { url: '/signup-pupil', title: 'Pupil Signup' },
    { url: '/faq', title: 'FAQ' },
    { url: '/lernmaterial', title: 'Lernmaterial' },
    { url: '/auszeichnungen', title: 'Auszeichnungen' },
    { url: '/presse', title: 'Presse' }
  ]

  for (const { url, title } of pages) {
    test(`${title} page loads without errors`, async ({ page }) => {
      await page.goto(url)
      
      // Check that page loads successfully (no 404 or 500 errors)
      expect(page.url()).toContain(url)
      
      // Check that there's a main heading
      await expect(page.locator('h1')).toBeVisible()
      
      // Check that footer is present
      await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible()
      
      // Check that no error messages are visible
      await expect(page.locator('text=404')).not.toBeVisible()
      await expect(page.locator('text=Error')).not.toBeVisible()
      await expect(page.locator('text=Something went wrong')).not.toBeVisible()
    })
  }

  test('blog page shows posts', async ({ page }) => {
    await page.goto('/blog')
    
    // Either posts are shown or a "no posts" message
    const hasContent = await page.locator('article, .post, [class*="post"]').count() > 0
    const hasMessage = await page.locator('text=Keine').isVisible()
    
    expect(hasContent || hasMessage).toBeTruthy()
  })

  test('standorte page shows locations', async ({ page }) => {
    await page.goto('/standorte')
    
    // Should have either a map or list of locations
    const hasMap = await page.locator('[class*="map"], #map, .mapbox').isVisible()
    const hasList = await page.locator('ul, ol, [class*="location"]').count() > 0
    
    expect(hasMap || hasList).toBeTruthy()
  })
})