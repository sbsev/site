// call with `node src/utils/googleTranslate.js`
// requires the credentials for a Google Cloud Translate service account
// to be in a file named googleTranslateApiKey.json at the project root

import 'dotenv/config'

import { v2 } from '@google-cloud/translate'
import prettier from 'prettier'
import { get_space } from './contentful'

async function translateContentfulEntries() {
  try {
    const cli_args = process.argv.slice(2)

    if (cli_args.length > 4)
      throw `wrong number of CLI args, expected between 0 and 4, got ${cli_args.length}`

    const [
      targetLocale = `ar`, // arabic
      sourceLocale = `de`,
      contentType = `page`,
      field = `body`,
    ] = cli_args

    const space = await get_space()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })

    // Create Google Cloud Translation client
    const translate = new v2.Translate()

    for (const itm of items) {
      const text = itm.fields[field][sourceLocale]

      // google translate supports HTML markup so we could parse markdown and revert after translation
      // this leaves links/slugs untranslated but drops HTML tags like <span class="foo">
      // that were in the MD before parsing
      let [translation] = await translate.translate(text, targetLocale)

      const formatted = prettier.format(translation, { parser: `markdown` })

      itm.fields[field][targetLocale] = formatted
      await itm.update()
      await itm.publish()
      const title = itm.fields.title[sourceLocale]
      // eslint-disable-next-line no-console
      console.log(
        `successfully translated ${contentType} '${title}' to ${targetLocale}`,
      )
    }
  } catch (error) {
    console.error(error)
  }
}

translateContentfulEntries()
