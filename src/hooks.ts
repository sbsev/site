// https://kit.svelte.dev/docs#hooks-getsession
export function getSession(): Record<string, string | undefined> {
  const keys = [
    `ALGOLIA_APP_ID`,
    `ALGOLIA_SEARCH_KEY`,
    `GOOGLE_MAPS_API_KEY`,
    `MAPBOX_PUBLIC_KEY`,
    `AIRTABLE_API_KEY`,
  ]

  const session = Object.fromEntries(keys.map((key) => [key, process.env[key]]))

  const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env
  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces/`
  session.gqlUri = `${ctfGqlUrl}${CONTENTFUL_SPACE_ID}?access_token=${CONTENTFUL_ACCESS_TOKEN}`

  return session
}
