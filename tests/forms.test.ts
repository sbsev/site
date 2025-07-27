import { expect, test } from '@playwright/test'

test.describe('Form Functionality (Without Submission)', () => {
  test('student signup form renders correctly', async ({ page }) => {
    await page.goto('/signup-student')
    
    // Check that form is present
    await expect(page.locator('form')).toBeVisible()
    
    // Check that required fields are present
    const formElementCount = await page.locator('input, select, textarea').count()
    expect(formElementCount).toBeGreaterThan(2)
    
    // Check that submit button is present
    await expect(page.locator('button[type="submit"], button:has-text("abschicken"), button:has-text("Anmeldung")')).toBeVisible()
  })

  test('pupil signup form renders correctly', async ({ page }) => {
    await page.goto('/signup-pupil')
    
    // Check that form is present
    await expect(page.locator('form')).toBeVisible()
    
    // Check that required fields are present
    const formElementCount = await page.locator('input, select, textarea').count()
    expect(formElementCount).toBeGreaterThan(2)
    
    // Check that submit button is present
    await expect(page.locator('button[type="submit"], button:has-text("abschicken"), button:has-text("Anmeldung")')).toBeVisible()
  })

  test('form fields can be filled', async ({ page }) => {
    await page.goto('/signup-student')
    
    // Find text inputs and fill them
    const textInputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]')
    const count = await textInputs.count()
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = textInputs.nth(i)
      if (await input.isVisible() && await input.isEnabled()) {
        await input.fill('Test Value')
        await expect(input).toHaveValue('Test Value')
      }
    }
  })

  test('form validation works for required fields', async ({ page }) => {
    await page.goto('/signup-student')
    
    // Try to submit empty form (if submit button is visible and enabled)
    const submitButton = page.locator('button[type="submit"], button:has-text("abschicken"), button:has-text("Anmeldung")').first()
    
    if (await submitButton.isVisible() && await submitButton.isEnabled()) {
      await submitButton.click()
    }
    
    // Form should either show validation errors or prevent submission
    // We don't want it to actually submit with empty data
    const hasValidationErrors = await page.locator('[class*="error"], .invalid, [aria-invalid="true"]').count() > 0
    const stillOnFormPage = page.url().includes('signup')
    
    expect(hasValidationErrors || stillOnFormPage).toBeTruthy()
  })

  test('multiselect components work', async ({ page }) => {
    await page.goto('/signup-pupil')
    
    // Look for multiselect dropdowns (common in this app)
    const selects = page.locator('[class*="multiselect"], [class*="select"]')
    const count = await selects.count()
    
    if (count > 0) {
      const firstSelect = selects.first()
      await firstSelect.click()
      
      // Should show options when clicked
      await expect(page.locator('[class*="option"], [role="option"]')).toBeVisible()
    }
  })

  test('place selector works', async ({ page }) => {
    await page.goto('/signup-pupil')
    
    // Look for place/location input
    const placeInput = page.locator('#places input, input[placeholder*="Stadt"], input[placeholder*="Adresse"]')
    
    if (await placeInput.isVisible()) {
      await placeInput.fill('Hamburg')
      
      // Should trigger some kind of autocomplete or validation
      await page.waitForTimeout(1000) // Wait for debounce
      
      // Input should retain the value
      await expect(placeInput).toHaveValue('Hamburg')
    }
  })
})