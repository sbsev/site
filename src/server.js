import 'dotenv/config'
import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

const {
  PORT,
  NODE_ENV,
  GOOGLE_ANALYTICS_ID,
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_KEY,
  GOOGLE_MAPS_API_KEY,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
} = process.env
const dev = NODE_ENV === `development`

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv(`static`, { dev }),
    sapper.middleware({
      session: () => ({
        GOOGLE_ANALYTICS_ID,
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_KEY,
        GOOGLE_MAPS_API_KEY,
        CONTENTFUL_SPACE_ID,
        CONTENTFUL_ACCESS_TOKEN,
      }),
    })
  )
  .listen(PORT, (err) => {
    // eslint-disable-next-line no-console
    if (err) console.log(`error`, err)
  })
