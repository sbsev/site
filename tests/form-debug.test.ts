import { expect, test } from '@playwright/test'

// Test to capture console logs and errors for debugging
test(`capture console logs and errors for pupil form`, async ({ page }) => {
  const consoleLogs: string[] = []
  const consoleErrors: string[] = []
  const networkErrors: string[] = []

  // Listen to console logs
  page.on(`console`, (msg) => {
    const logMessage = `[${msg.type()}] ${msg.text()}`
    // Filter out expected warnings that are noise
    if (
      !logMessage.includes(`'value' prop should be a Number`) &&
      !logMessage.includes(`'values' prop should be an Array`)
    ) {
      consoleLogs.push(logMessage)
      console.log(`Browser Console: ${logMessage}`)
    }
  })

  // Listen to console errors
  page.on(`pageerror`, (error) => {
    const errorMessage = `[Error] ${error.message}`
    consoleErrors.push(errorMessage)
    console.log(`Browser Error: ${errorMessage}`)
  })

  // Listen to network errors
  page.on(`requestfailed`, (request) => {
    const errorMessage = `[Network Error] ${request.url()} - ${request.failure()?.errorText || `Unknown error`}`
    networkErrors.push(errorMessage)
    console.log(`Network Error: ${errorMessage}`)
  })

  // Navigate to the pupil form
  await page.goto(`/signup-pupil`, { waitUntil: `networkidle` })

  // Wait for any dynamic content to load
  await page.waitForTimeout(2000)

  // Capture the current state
  const pageTitle = await page.title()
  const currentUrl = page.url()
  const formVisible = await page.locator(`form`).isVisible()
  const h1Text = await page.locator(`h1`).textContent()

  // Log the captured information
  console.log(`\n=== FORM DEBUGGING INFORMATION ===`)
  console.log(`Page Title: ${pageTitle}`)
  console.log(`Current URL: ${currentUrl}`)
  console.log(`Form Visible: ${formVisible}`)
  console.log(`H1 Text: ${h1Text}`)
  console.log(`\nConsole Logs (${consoleLogs.length}):`)
  consoleLogs.forEach((log) => console.log(`  ${log}`))
  console.log(`\nConsole Errors (${consoleErrors.length}):`)
  consoleErrors.forEach((error) => console.log(`  ${error}`))
  console.log(`\nNetwork Errors (${networkErrors.length}):`)
  networkErrors.forEach((error) => console.log(`  ${error}`))

  // Basic assertions to ensure the test provides value
  expect(currentUrl).toContain(`/signup-pupil`)
  expect(formVisible).toBe(true)
  expect(h1Text).toContain(`Anmeldung Schüler:innen`)

  // Store the debugging information for potential export
  const debugInfo = {
    pageTitle,
    currentUrl,
    formVisible,
    h1Text,
    consoleLogs,
    consoleErrors,
    networkErrors,
    timestamp: new Date().toISOString(),
  }

  // You could save this to a file or use it for further analysis
  console.log(`\n=== DEBUG INFO OBJECT ===`)
  console.log(JSON.stringify(debugInfo, null, 2))
})

// Test to capture form data loading state
test(`capture form data loading state and structure`, async ({ page }) => {
  const consoleLogs: string[] = []
  const formDataLogs: any[] = []

  // Listen to console logs
  page.on(`console`, (msg) => {
    const logMessage = msg.text()
    // Filter out expected warnings that are noise
    if (
      !logMessage.includes(`'value' prop should be a Number`) &&
      !logMessage.includes(`'values' prop should be an Array`)
    ) {
      consoleLogs.push(logMessage)
    }

    // Look for specific form-related logs
    if (
      logMessage.includes(`Client-side data received:`) ||
      logMessage.includes(`Form structure:`) ||
      logMessage.includes(`Form header check:`)
    ) {
      formDataLogs.push(logMessage)
    }
  })

  // Navigate to the pupil form
  await page.goto(`/signup-pupil`, { waitUntil: `networkidle` })

  // Wait for any dynamic content to load
  await page.waitForTimeout(3000)

  // Try to extract form data from the page
  const formData = await page.evaluate(() => {
    // Try to access any global variables that might contain form data
    const data = (window as any).__sveltekit_dev?.data || {}
    return {
      hasFormData: !!data,
      formData: data,
      // Also try to get data from any Svelte stores
      stores: {
        signupStore: (window as any).signupStore,
        // Add other potential stores
      },
    }
  })

  // Log the captured information
  console.log(`\n=== FORM DATA LOADING DEBUG ===`)
  console.log(`Form Data Logs (${formDataLogs.length}):`)
  formDataLogs.forEach((log) => console.log(`  ${log}`))
  console.log(`\nForm Data Object:`)
  console.log(JSON.stringify(formData, null, 2))

  // Check if we have the expected form structure
  const formFields = await page.locator(`form label`).count()
  const submitButton = await page
    .locator(`button[type="submit"]:not([disabled]):not([aria-hidden="true"])`)
    .isVisible()

  console.log(`\nForm Structure:`)
  console.log(`  - Number of form fields: ${formFields}`)
  console.log(`  - Submit button visible: ${submitButton}`)

  // Basic assertions
  expect(formFields).toBeGreaterThan(0)
  expect(submitButton).toBe(true)
})

// Test to capture student form for comparison
test(`capture student form data loading state for comparison`, async ({
  page,
}) => {
  const consoleLogs: string[] = []
  const formDataLogs: any[] = []

  // Listen to console logs
  page.on(`console`, (msg) => {
    const logMessage = msg.text()
    // Filter out expected warnings that are noise
    if (
      !logMessage.includes(`'value' prop should be a Number`) &&
      !logMessage.includes(`'values' prop should be an Array`)
    ) {
      consoleLogs.push(logMessage)
    }

    // Look for specific form-related logs
    if (
      logMessage.includes(`Client-side data received:`) ||
      logMessage.includes(`Form structure:`) ||
      logMessage.includes(`Form header check:`)
    ) {
      formDataLogs.push(logMessage)
    }
  })

  // Navigate to the student form
  await page.goto(`/signup-student`, { waitUntil: `networkidle` })

  // Wait for any dynamic content to load
  await page.waitForTimeout(3000)

  // Log the captured information
  console.log(`\n=== STUDENT FORM DATA LOADING DEBUG ===`)
  console.log(`Form Data Logs (${formDataLogs.length}):`)
  formDataLogs.forEach((log) => console.log(`  ${log}`))

  // Check form structure
  const formFields = await page.locator(`form label`).count()
  const submitButton = await page
    .locator(`button[type="submit"]:not([disabled]):not([aria-hidden="true"])`)
    .isVisible()

  console.log(`\nStudent Form Structure:`)
  console.log(`  - Number of form fields: ${formFields}`)
  console.log(`  - Submit button visible: ${submitButton}`)

  // Basic assertions
  expect(formFields).toBeGreaterThan(0)
  expect(submitButton).toBe(true)
})

// Test to capture markdown rendering issues
test(`capture markdown rendering state`, async ({ page }) => {
  await page.goto(`/signup-pupil`, { waitUntil: `networkidle` })

  // Check for raw markdown that should have been converted
  const rawMarkdownElements = await page.locator(`text=####`).count()
  const htmlEntities = await page.locator(`text=&#39;`).count()
  const unprocessedLinks = await page
    .locator(`text=[Datenschutz](/datenschutz)`)
    .count()

  console.log(`\n=== MARKDOWN RENDERING DEBUG ===`)
  console.log(`Raw markdown headers (####): ${rawMarkdownElements}`)
  console.log(`Unprocessed HTML entities (&#39;): ${htmlEntities}`)
  console.log(`Unprocessed markdown links: ${unprocessedLinks}`)

  // Check for properly rendered elements
  const renderedHeaders = await page.locator(`h4`).count()
  const renderedLinks = await page.locator(`a[href="/datenschutz"]`).count()

  console.log(`Properly rendered headers (h4): ${renderedHeaders}`)
  console.log(`Properly rendered links: ${renderedLinks}`)

  // Assertions - these should be 0 if markdown is working correctly
  expect(rawMarkdownElements).toBe(0)
  expect(htmlEntities).toBe(0)
  expect(unprocessedLinks).toBe(0)

  // These should be greater than 0 if markdown is working correctly
  expect(renderedHeaders).toBeGreaterThan(0)
  expect(renderedLinks).toBeGreaterThan(0)
})

// Test to capture Svelte 5 binding errors
test(`capture Svelte 5 binding errors`, async ({ page }) => {
  const consoleErrors: string[] = []
  const svelteErrors: string[] = []

  // Listen to console errors
  page.on(`pageerror`, (error) => {
    const errorMessage = error.message
    consoleErrors.push(errorMessage)

    // Look for Svelte-specific errors
    if (
      errorMessage.includes(`props_invalid_value`) ||
      errorMessage.includes(`bind:value`) ||
      errorMessage.includes(`Svelte error`)
    ) {
      svelteErrors.push(errorMessage)
    }
  })

  // Navigate to both forms to check for binding errors
  await page.goto(`/signup-pupil`, { waitUntil: `networkidle` })
  await page.waitForTimeout(2000)

  await page.goto(`/signup-student`, { waitUntil: `networkidle` })
  await page.waitForTimeout(2000)

  console.log(`\n=== SVELTE 5 BINDING ERROR DEBUG ===`)
  console.log(`Total Console Errors: ${consoleErrors.length}`)
  console.log(`Svelte-specific Errors: ${svelteErrors.length}`)

  if (svelteErrors.length > 0) {
    console.log(`\nSvelte Errors:`)
    svelteErrors.forEach((error) => console.log(`  ${error}`))
  }

  // Assertions - there should be no Svelte binding errors
  expect(svelteErrors.length).toBe(0)
})
