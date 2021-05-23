// call with `node src/utils/deeplTranslate.js`
// requires DEEPL_API_KEY, CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID
// to be provided in .env file

import 'dotenv/config.js'

import prettier from 'prettier'
import translate from 'deepl'

import { getSpace } from './contentful.js'

async function translateContentfulEntries() {
  try {
    const cli_args = process.argv.slice(2)

    if (cli_args.length > 4)
      throw `wrong number of CLI args, expected between 0 and 4, got ${cli_args.length}`

    const [
      targetLocale = `en`,
      sourceLocale = `de`,
      contentType = `page`,
      field = `body`,
    ] = cli_args

    const space = await getSpace()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })

    for (const itm of items) {
      const text = itm.fields[field][sourceLocale]

      const { data } = await translate({
        text,
        target_lang: targetLocale.toUpperCase(),
        auth_key: process.env.DEEPL_API_KEY,
        // optional parameters listed in the official docs can be passed here
        // https://deepl.com/docs-api/translating-text/request
        split_sentences: 1,
        // 0 - no splitting at all, whole input is treated as one sentence
        // 1 (default) - splits on interpunction and on newlines
        // 'nonewlines' - splits on interpunction only, ignoring newlines
      })
      const translation = data.translations[0].text
      const formatted = prettier.format(translation, { parser: `markdown` })

      itm.fields[field][targetLocale] = formatted
      // await itm.update()
      // await itm.publish()
      const title = itm.fields.title[sourceLocale]
      // eslint-disable-next-line no-console
      console.log(
        `successfully translated ${contentType} '${title}' to ${targetLocale}`
      )
    }
  } catch (error) {
    console.error(error)
  }
}

translateContentfulEntries()
