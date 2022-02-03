import type { GetSession, Handle } from '@sveltejs/kit'

export const getSession: GetSession = () => {
  const keys = [
    `ALGOLIA_APP_ID`,
    `ALGOLIA_SEARCH_KEY`,
    `MAPBOX_PUBLIC_KEY`,
    `AIRTABLE_API_KEY`,
  ]

  const session = Object.fromEntries(keys.map((key) => [key, process.env[key]]))

  const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env
  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces/`
  session.gqlUri = `${ctfGqlUrl}${CONTENTFUL_SPACE_ID}?access_token=${CONTENTFUL_ACCESS_TOKEN}`

  return session
}

// signup pages exhibit SSR errors, we somehow get duplicate DOM nodes
// maybe because they're generated from objects with referential inequality
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    ssr: !event.url.pathname.startsWith(`/signup`),
  })
