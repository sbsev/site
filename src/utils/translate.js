// call with `node src/utils/translate.js`
// requires the credentials for a Google Cloud Translate service account
// to be in a file named googleTranslateApiKey.json at the project root

require(`dotenv`).config()

const { Translate } = require(`@google-cloud/translate`).v2
const contentful = require(`contentful-management`)
const marked = require(`marked`)
const Turndown = require(`turndown`)
const prettier = require(`prettier`)

const turndown = new Turndown({
  headingStyle: `atx`,
  hr: `---`,
  bulletListMarker: `-`,
  codeBlockStyle: `fenced`,
})

async function getSpace() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })
  return await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
}

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

    // Create Google Cloud Translation client
    const translate = new Translate()

    for (const itm of items) {
      const text = itm.fields[field][sourceLocale]
      // google translate supports HTML markup so we parse markdown and revert after translation
      const html = marked(text)

      let [translation] = await translate.translate(html, targetLocale)

      const md = turndown.turndown(translation)
      const formatted = prettier.format(md, { parser: `markdown` })

      itm.fields[field][targetLocale] = formatted
      await itm.update()
    }
  } catch (error) {
    console.error(error)
  }
}

translateContentfulEntries()
