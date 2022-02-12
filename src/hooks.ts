import { dev } from '$app/env'
import type { Handle } from '@sveltejs/kit'
import { indexAlgolia } from 'svelte-algolia/server-side'
import { algoliaConfig } from './utils/algolia'

// only update Algolia indices if required env vars are defined
if (
  dev === false &&
  import.meta.env.VITE_ALGOLIA_APP_ID &&
  import.meta.env.VITE_ALGOLIA_ADMIN_KEY
) {
  // update Algolia search indices on production builds
  indexAlgolia(algoliaConfig)
}

// signup pages exhibit SSR errors, we somehow get duplicate DOM nodes
// maybe because they're generated from objects with referential inequality
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    ssr: !event.url.pathname.startsWith(`/signup`),
  })
