// import { dev } from '$app/env'
// import { indexAlgolia } from 'svelte-algolia/server-side'
// import { algoliaConfig } from './utils/algolia'

// const appId = import.meta.env.VITE_ALGOLIA_APP_ID as string
// const apiKey = import.meta.env.VITE_ALGOLIA_ADMIN_KEY as string

// // only update Algolia indices on production builds if required env vars are defined
// if (dev === false && appId && apiKey) {
//   indexAlgolia({ ...algoliaConfig, appId, apiKey })
// }

import type { Handle } from '@sveltejs/kit'

// signup pages exhibit SSR errors, we somehow get duplicate DOM nodes
// maybe because they're generated from objects with referential inequality
const no_ssr_routes = [`/anmeldung`, `/signup-pupil`, `/signup-student`]

export const handle: Handle = ({ event, resolve }) =>
  resolve(event, { ssr: !no_ssr_routes.includes(event.url.pathname) })
