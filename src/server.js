import 'dotenv/config'
import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

const keys = [
  `NODE_ENV`,
  `GOOGLE_ANALYTICS_ID`,
  `ALGOLIA_APP_ID`,
  `ALGOLIA_SEARCH_KEY`,
  `GOOGLE_MAPS_API_KEY`,
  `CONTENTFUL_SPACE_ID`,
  `CONTENTFUL_ACCESS_TOKEN`,
]

const session = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => keys.includes(key))
)

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === `development`

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env
const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces/`
session.gqlUri = `${ctfGqlUrl}${CONTENTFUL_SPACE_ID}?access_token=${CONTENTFUL_ACCESS_TOKEN}`

polka()
  .use(
    compression({ threshold: 0 }),
    sirv(`static`, { dev }),
    sapper.middleware({ session: () => session })
  )
  .listen(PORT, (err) => {
    // eslint-disable-next-line no-console
    if (err) console.log(`error`, err)
  })
