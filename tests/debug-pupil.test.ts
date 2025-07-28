import { test, expect } from '@playwright/test'

test('debug pupil signup page content', async ({ page }) => {
  await page.goto('/signup-pupil', { waitUntil: 'networkidle' })
  
  // Wait a bit more for any async loading
  await page.waitForTimeout(2000)
  
  // Get the actual page content
  const content = await page.content()
  console.log('Page HTML content:', content.substring(0, 2000))
  
  // Check what elements exist
  const bodyText = await page.locator('body').textContent()
  console.log('Body text content:', bodyText)
  
  // Check for specific elements
  const h1Elements = await page.locator('h1').count()
  console.log('Number of h1 elements found:', h1Elements)
  
  if (h1Elements > 0) {
    const h1Content = await page.locator('h1').first().textContent()
    const h1Html = await page.locator('h1').first().innerHTML()
    console.log('First h1 content:', h1Content)
    console.log('First h1 HTML:', h1Html)
  }
  
  // Check if "Loading form..." appears (fallback case)
  const loadingText = await page.locator('text=Loading form...').count()
  console.log('Loading form text found:', loadingText > 0)
})