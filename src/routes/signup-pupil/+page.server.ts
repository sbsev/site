import { dev } from '$app/environment'
import { fetch_chapters, fetch_yaml, parse_form_data } from '$lib/fetch'
import { canAcceptPupils } from '$lib/types'

// Pre-load all locale modules for Vite static analysis
const localeModules = {
  messages: import.meta.glob('../../signup-form/*/messages.yml', {
    eager: true,
  }),
  options: import.meta.glob('../../signup-form/*/options.yml', { eager: true }),
  pupil: import.meta.glob('../../signup-form/*/pupil.yml', { eager: true }),
}

function getLocaleModule(
  modules: Record<string, unknown>,
  locale: string,
  fallback: string = 'de',
) {
  const localePath = `../../signup-form/${locale}/`
  const fallbackPath = `../../signup-form/${fallback}/`

  // Find the module matching the locale, fallback to 'de' if not found
  for (const [path, mod] of Object.entries(modules)) {
    if (path.startsWith(localePath)) {
      return (mod as { default: unknown }).default ?? mod
    }
  }
  // Fallback
  for (const [path, mod] of Object.entries(modules)) {
    if (path.startsWith(fallbackPath)) {
      return (mod as { default: unknown }).default ?? mod
    }
  }
  return null
}

export const load = async ({ fetch: customFetch }: { fetch: typeof fetch }) => {
  try {
    // Get country from Contentful to determine locale
    const smallTexts = (await fetch_yaml('smallTexts', customFetch)) as {
      country?: string
    } | null
    const locale = smallTexts?.country || 'de'
    console.debug(`Loading pupil signup form for locale: ${locale}`)

    // Load locale-specific YAML data
    const messagesData = getLocaleModule(localeModules.messages, locale) || {
      submitSuccess: { title: `🎉 ⭐ 🎉`, note: `Success!` },
      submitError: { title: `😢`, note: `Error occurred.` },
      errMsg: { required: `This field is required` },
    }

    const optionsData = (getLocaleModule(localeModules.options, locale) ||
      {}) as Record<string, string[]>
    const rawFormData = getLocaleModule(localeModules.pupil, locale) || {
      header: {
        title: `Anmeldung Schüler:innen`,
        note: `Formular für Schüler:innen`,
      },
      fields: [
        {
          id: `chapter`,
          title: `Standort`,
          note: `Wähle einen unserer Nachhilfestandorte.`,
          required: true,
          type: `select`,
          maxSelect: 1,
        },
      ],
      submit: {
        title: `Anmeldung abschicken`,
        note: `Du bekommst innerhalb einer Minute eine Bestätigungs-Email von uns.`,
      },
    }

    console.debug(`YAML data loaded for locale ${locale}:`, {
      messages: !!messagesData,
      options: !!optionsData,
      raw_form: !!rawFormData,
    })

    let chapters = await fetch_chapters(customFetch)
    console.debug(`chapters loaded:`, chapters)

    // Handle case where chapters might be undefined or not an array
    if (!Array.isArray(chapters)) {
      chapters = []
    }

    chapters = chapters.filter((chap) => canAcceptPupils(chap.status))

    const form = parse_form_data({
      ...rawFormData,
      ...messagesData,
    } as Parameters<typeof parse_form_data>[0])
    console.debug(`form parsed:`, form)

    // In dev mode, add a test chapter at the beginning for testing purposes if defined
    if (dev) {
      const testBaseId = import.meta.env.VITE_AIRTABLE_TEST_BASE_ID
      if (testBaseId) {
        chapters.unshift({
          title: `Test`,
          baseId: testBaseId,
          slug: `test`,
          coords: { lat: 0, lng: 0 },
          status: 'active',
          token: ``,
        })
      }
    }

    for (const field of form.fields || []) {
      if (field.id in optionsData) {
        field.options = optionsData[field.id]
      } else if (field.id === `chapter`) {
        field.options = chapters.map((chap) => chap.title)
      }
    }

    console.debug(`Returning data:`, { chapters, form })

    // Ensure data is properly serializable for hydration
    return {
      chapters: JSON.parse(JSON.stringify(chapters)),
      form: JSON.parse(JSON.stringify(form)),
    }
  } catch (error) {
    console.error(`Error loading pupil signup form:`, error)
    console.error(
      `Error stack:`,
      error instanceof Error ? error.stack : `Unknown error`,
    )

    // Return fallback form structure
    const basicForm = {
      header: { title: `Anmeldung Schüler:innen`, note: `Form loading...` },
      fields: [
        {
          id: `chapter`,
          title: `Standort`,
          required: true,
          type: `select`,
          maxSelect: 1,
        },
      ],
      submit: { title: `Anmeldung abschicken`, note: `` },
      submitSuccess: { title: `Success`, note: `Success!` },
      submitError: { title: `Error`, note: `Error occurred` },
      errMsg: { required: `This field is required` },
    }

    console.debug(`Returning fallback form:`, basicForm)
    return {
      chapters: [],
      form: JSON.parse(JSON.stringify(basicForm)),
    }
  }
}
