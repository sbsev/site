/* eslint-disable no-console */
import 'dotenv/config.js'
import contentful from 'contentful-management'
import prettier from 'prettier'

// Before running any of the functions in this file, first generate a Content Management Token (CMT) at
// https://app.contentful.com/spaces/<space-id>/api/cma_tokens and add it to your .env
// file along with the space ID.

// Contentful entries returned by env.getEntries() are objects with update/publish/archive/etc. methods
// as well as a fields and a sys key. Only the attributes in fields can be changed and then e.g.
// published(). The data in entry.sys can be consumed but is non-user editable. The API will throw
// if you modify sys and then attempt publish() or update().

// See https://github.com/contentful/contentful-management.js/issues/57 for how to link entries/assets.

export async function getSpace() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })
  return await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
}

export async function searchStringInContentType(args) {
  try {
    if (args.length < 1 || args.length > 4)
      throw `wrong number of CLI args, expected between 1 and 4, got ${args.length}`

    const {
      searchTerm,
      contentType = `page`,
      field = `body`,
      locale = `de`,
    } = args

    console.log(`Now running searchStringInContentType with args = `, {
      searchTerm,
      contentType,
      field,
      locale,
    })

    const space = await getSpace()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })
    items = items.filter((item) =>
      item?.fields[field][locale]?.includes(searchTerm)
    )
    items = items.map((item) => item.fields.slug[locale])
    console.log(
      `'${contentType}' entries containing '${searchTerm}' in field '${field}.${locale}':`,
      items
    )
  } catch (error) {
    console.error(error)
  }
}

export async function replaceStringInContentType(args) {
  try {
    const nArgs = Object.keys(args).length
    if (nArgs < 2 || nArgs > 6)
      throw `wrong number of CLI args, expected between 2 and 6, got ${nArgs}`

    const {
      searchTerm,
      replaceTerm,
      dryRun,
      contentType = `page`,
      field = `body`,
      locale = `de`,
    } = args

    console.log(`Now running replaceStringInContentType with args = `, {
      searchTerm,
      replaceTerm,
      contentType,
      field,
      locale,
      dryRun,
    })

    const space = await getSpace()

    const env = await space.getEnvironment(`master`)
    let { items } = await env.getEntries({ content_type: contentType })
    let counter = 0

    for (const itm of items) {
      if (dryRun && dryRun < counter) {
        console.log(`\nreached dryRun count ${dryRun}, stopping`)
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
        replaceTerm
      )
      if (dryRun) {
        console.log(
          `new ${field}.${locale} of ${contentType} ${itm?.fields?.title.de} after replacement: ${itm.fields[field][locale]}`
        )
      } else {
        await itm.update()
        console.log(
          `performed replacement in ${contentType} ${itm?.fields?.title.de}`
        )
        // await itm.publish()
      }
    }
    if (!dryRun) console.log(`\ntotal replacements performed: ${counter}`)
    if (counter === 0) console.log(`found 0 matches`)
  } catch (error) {
    console.error(error)
  }
}

export async function prettierFormatMd(args) {
  try {
    const nArgs = Object.keys(args).length
    if (nArgs < 0 || nArgs > 3)
      throw `wrong number of CLI args, expected between 2 and 6, got ${nArgs}`

    const { contentType = `page`, field = `body`, locale = `de` } = args

    console.log(`Now running prettierFormatMd with args = `, {
      contentType,
      field,
      locale,
    })

    const space = await getSpace()

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
        console.log(`formatted ${contentType} ${itm?.fields?.title.de}`)
      }
    }
    if (counter === 0) console.log(`performed 0 formats`)
    else console.log(`\ntotal ${contentType}s formatted: ${counter}`)
  } catch (error) {
    console.error(error)
  }
}

// To call functions in this file from the command line, run:
// node src/utils/contentful.js searchStringInContentType arg1=foo arg2=bar

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly
  const funcs = {
    searchStringInContentType,
    replaceStringInContentType,
    prettierFormatMd,
  }

  let [funcName, ...args] = process.argv.slice(2) // first two are path to node and the name of script

  args = Object.fromEntries(args.map((arg) => arg.split(`=`)))

  for (const [key, val] of Object.entries(args)) {
    if (!val) throw `received undefined CLI flag ${key}`
  }

  funcs[funcName](args)
}
