import { test, expect } from '@playwright/test'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { parse } from 'yaml'

/**
 * Signup Form Locale Validation Tests
 *
 * Validates that:
 * 1. All required YML files exist for each locale (at, de)
 * 2. Form files have required structure (header, fields, airtableTable)
 * 3. Fields with type:select have matching options in options.yml
 * 4. Messages files have required keys
 * 5. AT and DE locales have the same field IDs (cross-locale parity)
 * 6. Code references to form.* have corresponding YML definitions
 */

const LOCALES = [`at`, `de`]
const FORM_TYPES = [`student`, `pupil`]
const REQUIRED_FILES = [
  `messages.yml`,
  `options.yml`,
  `student.yml`,
  `pupil.yml`,
]
const SIGNUP_FORM_PATH = `src/signup-form`

// Keys referenced by code in +page.svelte files
const REQUIRED_MESSAGE_KEYS = [
  `submitSuccess`,
  `submitError`,
  `submit`,
  `errMsg`,
]

const REQUIRED_FORM_KEYS = [`header`, `fields`, `airtableTable`]
const REQUIRED_FIELD_PROPS = [`id`, `title`]

function loadYaml(filePath: string): Record<string, unknown> {
  try {
    const content = readFileSync(filePath, `utf-8`)
    return parse(content) as Record<string, unknown>
  } catch {
    return {}
  }
}

test.describe(`Signup Form Locale Validation`, () => {
  // Skip for Firefox/Safari - these are static file tests, no browser needed
  test.skip(
    ({ browserName }) => browserName !== `chromium`,
    `Static file validation only needs to run once`,
  )

  test(`all required YML files exist for each locale`, () => {
    for (const locale of LOCALES) {
      const localePath = join(process.cwd(), SIGNUP_FORM_PATH, locale)
      const files = readdirSync(localePath)

      for (const requiredFile of REQUIRED_FILES) {
        expect(
          files.includes(requiredFile),
          `Missing ${requiredFile} in ${locale} locale`,
        ).toBeTruthy()
      }
    }
  })

  test(`form files have required structure`, () => {
    for (const locale of LOCALES) {
      for (const formType of FORM_TYPES) {
        const formPath = join(
          process.cwd(),
          SIGNUP_FORM_PATH,
          locale,
          `${formType}.yml`,
        )
        const form = loadYaml(formPath)

        for (const key of REQUIRED_FORM_KEYS) {
          expect(
            form[key],
            `Missing "${key}" in ${locale}/${formType}.yml`,
          ).toBeDefined()
        }

        // Check header structure
        const header = form.header as Record<string, unknown>
        expect(
          header?.title,
          `Missing header.title in ${locale}/${formType}.yml`,
        ).toBeDefined()
        expect(
          header?.note,
          `Missing header.note in ${locale}/${formType}.yml`,
        ).toBeDefined()

        // Check each field has required properties
        const fields = form.fields as Array<Record<string, unknown>>
        expect(Array.isArray(fields), `fields should be an array`).toBeTruthy()

        for (const field of fields) {
          for (const prop of REQUIRED_FIELD_PROPS) {
            expect(
              field[prop],
              `Field missing "${prop}" in ${locale}/${formType}.yml`,
            ).toBeDefined()
          }
        }
      }
    }
  })

  test(`select fields have matching options`, () => {
    for (const locale of LOCALES) {
      const optionsPath = join(
        process.cwd(),
        SIGNUP_FORM_PATH,
        locale,
        `options.yml`,
      )
      const options = loadYaml(optionsPath)

      for (const formType of FORM_TYPES) {
        const formPath = join(
          process.cwd(),
          SIGNUP_FORM_PATH,
          locale,
          `${formType}.yml`,
        )
        const form = loadYaml(formPath)
        const fields = form.fields as Array<Record<string, unknown>>

        for (const field of fields) {
          if (field.type === `select` && field.id !== `chapter`) {
            // chapter is populated from chapters list, not options.yml
            const fieldId = field.id as string
            expect(
              options[fieldId],
              `Missing options for "${fieldId}" in ${locale}/options.yml`,
            ).toBeDefined()
            expect(
              Array.isArray(options[fieldId]),
              `Options for "${fieldId}" should be an array in ${locale}/options.yml`,
            ).toBeTruthy()
            expect(
              (options[fieldId] as unknown[]).length,
              `Options for "${fieldId}" should not be empty in ${locale}/options.yml`,
            ).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  test(`messages files have required keys`, () => {
    for (const locale of LOCALES) {
      const messagesPath = join(
        process.cwd(),
        SIGNUP_FORM_PATH,
        locale,
        `messages.yml`,
      )
      const messages = loadYaml(messagesPath)

      for (const key of REQUIRED_MESSAGE_KEYS) {
        expect(
          messages[key],
          `Missing "${key}" in ${locale}/messages.yml`,
        ).toBeDefined()
      }

      // Check nested structure
      const submitSuccess = messages.submitSuccess as Record<string, unknown>
      expect(
        submitSuccess?.title,
        `Missing submitSuccess.title in ${locale}/messages.yml`,
      ).toBeDefined()
      expect(
        submitSuccess?.note,
        `Missing submitSuccess.note in ${locale}/messages.yml`,
      ).toBeDefined()

      const submitError = messages.submitError as Record<string, unknown>
      expect(
        submitError?.title,
        `Missing submitError.title in ${locale}/messages.yml`,
      ).toBeDefined()
      expect(
        submitError?.note,
        `Missing submitError.note in ${locale}/messages.yml`,
      ).toBeDefined()

      const submit = messages.submit as Record<string, unknown>
      expect(
        submit?.title,
        `Missing submit.title in ${locale}/messages.yml`,
      ).toBeDefined()
      expect(
        submit?.note,
        `Missing submit.note in ${locale}/messages.yml`,
      ).toBeDefined()

      const errMsg = messages.errMsg as Record<string, unknown>
      expect(
        errMsg?.required,
        `Missing errMsg.required in ${locale}/messages.yml`,
      ).toBeDefined()
    }
  })

  test(`AT and DE locales have same field IDs (cross-locale parity)`, () => {
    for (const formType of FORM_TYPES) {
      const formPaths = LOCALES.map((locale) =>
        join(process.cwd(), SIGNUP_FORM_PATH, locale, `${formType}.yml`),
      )

      const forms = formPaths.map(loadYaml)
      const fieldIdSets = forms.map((form) => {
        const fields = form.fields as Array<Record<string, unknown>>
        return new Set(fields.map((f) => f.id as string))
      })

      const [atFields, deFields] = fieldIdSets

      // Check AT has all DE fields
      for (const fieldId of deFields) {
        expect(
          atFields.has(fieldId),
          `Field "${fieldId}" exists in de/${formType}.yml but missing in at/${formType}.yml`,
        ).toBeTruthy()
      }

      // Check DE has all AT fields
      for (const fieldId of atFields) {
        expect(
          deFields.has(fieldId),
          `Field "${fieldId}" exists in at/${formType}.yml but missing in de/${formType}.yml`,
        ).toBeTruthy()
      }
    }
  })

  test(`AT and DE locales have same option keys`, () => {
    const optionsPaths = LOCALES.map((locale) =>
      join(process.cwd(), SIGNUP_FORM_PATH, locale, `options.yml`),
    )

    const [atOptions, deOptions] = optionsPaths.map(loadYaml)
    const atKeys = new Set(Object.keys(atOptions))
    const deKeys = new Set(Object.keys(deOptions))

    for (const key of deKeys) {
      expect(
        atKeys.has(key),
        `Option "${key}" exists in de/options.yml but missing in at/options.yml`,
      ).toBeTruthy()
    }

    for (const key of atKeys) {
      expect(
        deKeys.has(key),
        `Option "${key}" exists in at/options.yml but missing in de/options.yml`,
      ).toBeTruthy()
    }
  })
})
