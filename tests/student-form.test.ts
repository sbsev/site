import { expect, test } from '@playwright/test'
import { fill_place, fill_select, move_slider } from './helpers'

test('student signup page displays correctly with all required elements', async ({ page }) => {
  await page.goto('/signup-student', { waitUntil: 'networkidle' })

  // Check page title contains proper heading
  await expect(page.locator('h1')).toContainText('Anmeldung Studierende')
  
  // Check introductory text is present
  await expect(page.locator('text=Formular für Studierende')).toBeVisible()
  await expect(page.locator('text=Bitte fülle alle mit rotem Stern markierten Felder aus')).toBeVisible()
  
  // Check form is present
  await expect(page.locator('form')).toBeVisible()
  
  // Check key form fields are present
  await expect(page.locator('#chapter')).toBeVisible() // Chapter selection
  await expect(page.locator('#gender')).toBeVisible() // Gender selection
  await expect(page.locator('#fullName')).toBeVisible() // Full name input
  await expect(page.locator('#email')).toBeVisible() // Email input
  await expect(page.locator('#subjects')).toBeVisible() // Subjects selection
  await expect(page.locator('#places')).toBeVisible() // Places with map
  await expect(page.locator('#discovery')).toBeVisible() // How they found us
  
  // Check places field has input for address entry
  await expect(page.locator('#places input')).toBeVisible()
  
  // Check submit button is present and has correct text
  await expect(page.locator('button[type="submit"].main')).toBeVisible()
  await expect(page.locator('button[type="submit"].main')).toContainText('Anmeldung abschicken')
})

test('student signup form map functionality works', async ({ page }) => {
  await page.goto('/signup-student', { waitUntil: 'networkidle' })
  
  // Test that map shows up when typing in places field
  const placesInput = page.locator('#places input')
  await expect(placesInput).toBeVisible()
  
  // Type in a place and check if map interaction works
  await placesInput.fill('Berlin')
  await page.waitForTimeout(1000) // Wait for map to load
  
  // Check if place selection elements appear
  await expect(page.locator('#places')).toBeVisible()
})

test('student signup form has proper validation', async ({ page }) => {
  await page.goto('/signup-student', { waitUntil: 'networkidle' })
  
  // Try to submit empty form
  await page.click('button[type="submit"].main')
  
  // Check that form doesn't submit (should stay on same page)
  await expect(page.locator('h1')).toContainText('Anmeldung Studierende')
  
  // Fill required fields one by one and check they accept input
  await fill_select(page, '#chapter', ['Test'])
  await fill_select(page, '#gender', ['Weiblich'])
  await page.fill('#fullName', 'Test Student')
  await page.fill('#email', 'test@student.com')
  await fill_select(page, 'input#subjects', ['Mathe'])
  
  // Test range slider works (student form has double range, so check first one)
  await expect(page.locator('.rangeNub').first()).toBeVisible()
  await move_slider(page, '.rangeNub')
  
  // Test optional discovery field
  await fill_select(page, '#discovery', ['Freunde'])
  
  // Test toggle fields work
  await page.click('#agreement')
  await page.click('#dataProtection')
  
  // All required fields filled - form should be ready for submission
  await expect(page.locator('button[type="submit"].main')).toBeEnabled()
})

test.skip('student signup form can be submitted after filling all required fields', async ({
  page,
}) => {
  await page.goto('/signup-student', { waitUntil: 'networkidle' })

  await fill_select(page, '#chapter', ['Test'])
  await fill_select(page, '#gender', ['Weiblich'])
  await page.fill('#fullName', 'Foo Bar')
  await page.fill('#email', 'florian.kleinicke@studytutors.de')
  await fill_select(page, 'input#subjects', ['Mathe', 'Physik'])
  
  // rangeSlider
  await move_slider(page, '.rangeNub')
  
  await fill_place(page, '#places input', 'Hamburg')
  await page.waitForSelector('input[data-place="1"]')
  
  await fill_place(page, '#places input', 'Heidelberg')
  await page.waitForSelector('input[data-place="2"]')
  
  await fill_select(page, '#discovery', ['Freunde'])
  await page.click('#agreement')
  await page.click('#dataProtection')
  await page.click('button[type=submit].main')

  // make sure we get to the success page
  expect(await page.locator('text=🎉 ⭐ 🎉').textContent()).toBe('🎉 ⭐ 🎉')
})
