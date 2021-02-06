/* eslint-disable no-console */
import 'dotenv/config.js'
import contentful from 'contentful-management'

// Before running any of the functions in this file, first generate a Content Management Token (CMT) at
// https://app.contentful.com/spaces/gi9muc70s4ub/api/cma_tokens and add it to your .env
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
  if (args.length < 1 || args.length > 4)
    throw `wrong number of CLI args, expected between 1 and 4, got ${args.length}`

  const {
    searchTerm,
    contentType = `page`,
    field = `body`,
    locale = `de`,
  } = args

  console.log(`args:`, { searchTerm, contentType, field, locale })

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
}

export async function replaceStringInContentType(args) {
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

  console.log(`args:`, {
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
    counter += 1
    if (dryRun && dryRun < counter) {
      console.log(`reached dryRun count ${dryRun}, stopping`)
      return
    }

    if (!itm?.fields[field][locale]?.includes(searchTerm)) {
      console.log(`skipping ${itm?.fields?.title[locale]}`)
      continue
    }

    itm.fields[field][locale] = itm?.fields[field][locale]?.replaceAll(
      searchTerm,
      replaceTerm
    )
    if (dryRun)
      console.log(
        `new ${field}.${locale} after replacement: ${itm.fields[field][locale]}`
      )
    else {
      await itm.update()
      // await itm.publish()
    }
  }
}

// To call functions in this file from the command line, run:
// node src/utils/contentful.mjs searchStringInContentType arg1=foo arg2=bar

if (import.meta.url === `file://${process.argv[1]}`) {
  // Module was not imported but called directly
  const funcs = { searchStringInContentType, replaceStringInContentType }

  let [funcName, ...args] = process.argv.slice(2) // first two are path to node and the name of script

  args = Object.fromEntries(args.map((arg) => arg.split(`=`)))

  for (const [key, val] of Object.entries(args)) {
    if (!val) throw `received undefined CLI flag ${key}`
  }

  funcs[funcName](args)
}
