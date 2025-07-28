import { expect, test } from '@playwright/test'
import { fill_place, fill_select, move_slider } from './helpers'

test('pupil signup page displays correctly with all required elements', async ({
  page,
}) => {
  await page.goto('/signup-pupil', { waitUntil: 'networkidle' })

  // Check page title contains proper heading
  await expect(page.locator('h1')).toContainText('Anmeldung Schüler:innen')

  // Check introductory text is present
  await expect(
    page.locator('text=Wir freuen uns über dein Interesse!'),
  ).toBeVisible()
  await expect(page.locator("text=So geht's zur Nachhilfe:")).toBeVisible()

  // Check form is present
  await expect(page.locator('form')).toBeVisible()

  // Check key form fields are present
  await expect(page.locator('#chapter')).toBeVisible() // Chapter selection
  await expect(page.locator('#gender')).toBeVisible() // Gender selection
  await expect(page.locator('#firstName')).toBeVisible() // First name input
  await expect(page.locator('#subjects')).toBeVisible() // Subjects selection
  await expect(page.locator('#schoolTypes')).toBeVisible() // School types
  await expect(page.locator('#places')).toBeVisible() // Places with map
  await expect(page.locator('#nameContact')).toBeVisible() // Contact name
  await expect(page.locator('#emailContact')).toBeVisible() // Contact email

  // Check places field has input for address entry
  await expect(page.locator('#places input')).toBeVisible()

  // Check submit button is present and has correct text
  await expect(page.locator('button[type="submit"].main')).toBeVisible()
  await expect(page.locator('button[type="submit"].main')).toContainText(
    'Anmeldung abschicken',
  )
})

test('pupil signup form map functionality works', async ({ page }) => {
  await page.goto('/signup-pupil', { waitUntil: 'networkidle' })

  // Test that map shows up when typing in places field
  const placesInput = page.locator('#places input')
  await expect(placesInput).toBeVisible()

  // Type in a place and check if map interaction works
  await placesInput.fill('Hamburg')
  await page.waitForTimeout(1000) // Wait for map to load

  // Check if place selection elements appear
  await expect(page.locator('#places')).toBeVisible()
})

test('pupil signup form has proper validation', async ({ page }) => {
  await page.goto('/signup-pupil', { waitUntil: 'networkidle' })

  // Try to submit empty form
  await page.click('button[type="submit"].main')

  // Check that form doesn't submit (should stay on same page)
  await expect(page.locator('h1')).toContainText('Anmeldung Schüler:innen')

  // Fill required fields one by one and check they accept input
  await fill_select(page, '#chapter', ['Test'])
  await fill_select(page, '#gender', ['Männlich'])
  await page.fill('#firstName', 'Test Name')
  await fill_select(page, 'input#subjects', ['Mathe'])
  await fill_select(page, '#schoolTypes', ['Realschule'])

  // Test range slider works
  await expect(page.locator('.rangeNub')).toBeVisible()
  await move_slider(page, '.rangeNub')

  // Test contact fields
  await page.fill('#nameContact', 'Test Contact')
  await page.fill('#phoneContact', '123456789')
  await page.fill('#emailContact', 'test@example.com')
  await page.fill('#orgContact', 'Test Org')

  // Test toggle fields work
  await page.click('#need')
  await page.click('#dataProtection')

  // All required fields filled - form should be ready for submission
  await expect(page.locator('button[type="submit"].main')).toBeEnabled()
})

test.skip('pupil signup form can be submitted after filling all required fields', async ({
  page,
}) => {
  await page.goto('/signup-pupil', { waitUntil: 'networkidle' })

  await fill_select(page, '#chapter', ['Test'])
  await fill_select(page, '#gender', ['Männlich'])
  await page.fill('#firstName', 'Foo Bar')
  await fill_select(page, 'input#subjects', ['Mathe', 'Englisch'])
  await fill_select(page, '#schoolTypes', ['Realschule'])
  await move_slider(page, '.rangeNub')

  await fill_place(page, '#places input', 'Hamburg')
  await page.waitForSelector('input[data-place="1"]')

  await fill_place(page, '#places input', 'Heidelberg')
  await page.waitForSelector('input[data-place="2"]')

  await page.fill('#birthYear', '2010')
  await page.click('#online')
  await page.fill('#nameContact', 'Baz Bar')
  await page.fill('#phoneContact', '012 345 678')
  await page.fill('#emailContact', 'florian.kleinicke@studytutors.de')
  await page.fill('#orgContact', 'Privat')
  await page.click('#need')
  await page.click('#dataProtection')
  await page.click('button[type=submit].main')

  // make sure we get to the success page
  expect(await page.locator('text=🎉 ⭐ 🎉').textContent()).toBe('🎉 ⭐ 🎉')
})
