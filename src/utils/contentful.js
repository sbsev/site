/* eslint-disable no-console */
import contentful from 'contentful-management'
import 'dotenv/config'
import prettier from 'prettier'

// Before running any of the functions in this file, first generate a Content Management Token (CMT) at
// https://app.contentful.com/spaces/<space-id>/api/cma_tokens and add it to your .env
// file along with the space ID.

// Contentful entries returned by env.getEntries() are objects with update/publish/archive/etc. methods
// as well as a fields and a sys key. Only the attributes in fields can be changed and then e.g.
// published(). The data in entry.sys can be consumed but is non-user editable. The API will throw
// if you modify sys and then attempt publish() or update().

// See https://github.com/contentful/contentful-management.js/issues/57 for how to link entries/assets.

export async function get_space() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })
  return await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
}

export async function search_string_in_content_type(args) {
  try {
    if (args.length < 1 || args.length > 4)
      throw `wrong number of CLI args, expected between 1 and 4, got ${args.length}`

    const {
      searchTerm,
      contentType = `page`,
      field = `body`,
      locale = `de`,
    } = args

    console.debug(`Now running search_string_in_content_type with args = `, {
      searchTerm,
      contentType,
      field,
      locale,
    })

    const space = await get_space()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })
    items = items.filter((item) =>
      item?.fields[field][locale]?.includes(searchTerm),
    )
    items = items.map((item) => item.fields.slug[locale])
    console.debug(
      `'${contentType}' entries containing '${searchTerm}' in field '${field}.${locale}':`,
      items,
    )
  } catch (error) {
    console.error(error)
  }
}

export async function replace_string_in_content_type(args) {
  try {
    const n_args = Object.keys(args).length
    if (n_args < 2 || n_args > 6)
      throw `wrong number of CLI args, expected between 2 and 6, got ${n_args}`

    const {
      searchTerm,
      replaceTerm,
      dryRun,
      contentType = `page`,
      field = `body`,
      locale = `de`,
    } = args

    console.debug(`Now running replace_string_in_content_type with args = `, {
      searchTerm,
      replaceTerm,
      contentType,
      field,
      locale,
      dryRun,
    })

    const space = await get_space()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })
    let counter = 0

    for (const itm of items) {
      if (dryRun && dryRun < counter) {
        console.debug(`\nreached dryRun count ${dryRun}, stopping`)
        return
      }

      if (!itm?.fields[field][locale]?.includes(searchTerm)) {
        // skip items that don't match searchTerm
        continue
      }
      // only increment counter if field actually includes searchTerm
      // and needed replacement
      counter += 1

      itm.fields[field][locale] = itm?.fields[field][locale]?.replaceAll(
        searchTerm,
        replaceTerm,
      )
      if (dryRun) {
        console.debug(
          `new ${field}.${locale} of ${contentType} ${itm?.fields?.title.de} after replacement: ${itm.fields[field][locale]}`,
        )
      } else {
        await itm.update()
        console.debug(
          `performed replacement in ${contentType} ${itm?.fields?.title.de}`,
        )
        // await itm.publish()
      }
    }
    if (!dryRun) console.debug(`\ntotal replacements performed: ${counter}`)
    if (counter === 0) console.debug(`found 0 matches`)
  } catch (error) {
    console.error(error)
  }
}

export async function prettier_format_md(args) {
  try {
    const n_args = Object.keys(args).length
    if (n_args < 0 || n_args > 3)
      throw `wrong number of CLI args, expected between 2 and 6, got ${n_args}`

    const { contentType = `page`, field = `body`, locale = `de` } = args

    console.debug(`Now running prettierFormatMd with args = `, {
      contentType,
      field,
      locale,
    })

    const space = await get_space()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })
    let counter = 0

    for (const itm of items) {
      const formatted = prettier.format(itm?.fields[field][locale], {
        parser: `markdown`,
      })
      if (formatted !== itm.fields[field][locale]) {
        counter += 1
        itm.fields[field][locale] = formatted

        await itm.update()
        console.debug(`formatted ${contentType} ${itm?.fields?.title.de}`)
      }
    }
    if (counter === 0) console.debug(`performed 0 formats`)
    else console.debug(`\ntotal ${contentType}s formatted: ${counter}`)
  } catch (error) {
    console.error(error)
  }
}

// To call functions in this file from the command line, run:
// node src/contentful.js search_string_in_content_type arg1=foo arg2=bar

// example on 2023-01-11
// node src/contentful.js replace_string_in_content_type searchTerm='t*innen' replaceTerm='t\*innen'

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly
  const funcs = {
    search_string_in_content_type,
    replace_string_in_content_type,
    prettier_format_md,
  }

  let [funcName, ...args] = process.argv.slice(2) // first two are path to node and the name of script

  args = Object.fromEntries(args.map((arg) => arg.split(`=`)))

  for (const [key, val] of Object.entries(args)) {
    if (!val) throw `received undefined CLI flag ${key}`
  }

  funcs[funcName](args)
}
