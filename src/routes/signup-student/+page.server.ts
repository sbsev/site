import { dev } from '$app/environment'
import { fetch_chapters, parse_form_data } from '$lib/fetch'
import messages from '../../signup-form/de/messages.yml'
import options from '../../signup-form/de/options.yml'
import raw_form from '../../signup-form/de/student.yml'

export const load = async () => {
  try {
    console.log('Loading student signup form - static imports...')

    // Use the imported YAML data directly
    const messagesData = messages || {
      submitSuccess: { title: '🎉 ⭐ 🎉', note: 'Success!' },
      submitError: { title: '😢', note: 'Error occurred.' },
      errMsg: { required: 'This field is required' },
    }

    const optionsData = options || {}
    const rawFormData = raw_form || {
      header: {
        title: 'Anmeldung Studierende',
        note: 'Formular für Studierende',
      },
      fields: [
        {
          id: 'chapter',
          title: 'Standort',
          note: 'An welchem Standort möchtest du Nachhilfe geben?',
          required: true,
          type: 'select',
          maxSelect: 1,
        },
      ],
      submit: {
        title: 'Anmeldung abschicken',
        note: 'Du bekommst innerhalb einer Minute eine Bestätigungs-Email von uns.',
      },
    }

    console.log('YAML data loaded:', {
      messages: !!messagesData,
      options: !!optionsData,
      raw_form: !!rawFormData,
    })

    let chapters = await fetch_chapters()
    console.log('chapters loaded:', chapters)

    // Handle case where chapters might be undefined or not an array
    if (!Array.isArray(chapters)) {
      chapters = []
    }

    chapters = chapters.filter((chap) => chap.acceptsSignups)

    const form = parse_form_data({ ...rawFormData, ...messagesData })
    console.log('form parsed:', form)

    if (dev && chapters.length > 0) {
      chapters[0] = {
        ...chapters[0],
        title: `Test`,
        baseId: `appe3hVONuwBkuQv1`,
      }
    }

    for (const field of form.fields || []) {
      if (field.id in optionsData) {
        field.options = optionsData[field.id]
      } else if (field.id === `chapter`) {
        field.options = chapters.map((chap) => chap.title)
      }
    }

    console.log('Returning data:', { chapters, form })

    // Ensure data is properly serializable for hydration
    return {
      chapters: JSON.parse(JSON.stringify(chapters)),
      form: JSON.parse(JSON.stringify(form)),
    }
  } catch (error) {
    console.error('Error loading student signup form:', error)
    console.error('Error stack:', (error as Error).stack)

    // Return fallback form structure
    const basicForm = {
      header: { title: 'Anmeldung Studierende', note: 'Form loading...' },
      fields: [
        {
          id: 'chapter',
          title: 'Standort',
          required: true,
          type: 'select',
          maxSelect: 1,
        },
      ],
      submit: { title: 'Anmeldung abschicken', note: '' },
      submitSuccess: { title: 'Success', note: 'Success!' },
      submitError: { title: 'Error', note: 'Error occurred' },
      errMsg: { required: 'This field is required' },
    }

    console.log('Returning fallback form:', basicForm)
    return {
      chapters: [],
      form: JSON.parse(JSON.stringify(basicForm)),
    }
  }
}
