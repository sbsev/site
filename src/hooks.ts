import { dev } from '$app/env'
import type { Handle } from '@sveltejs/kit'
import { indexAlgolia } from 'svelte-algolia/server-side'
import { algoliaConfig } from './utils/algolia'

if (dev === false) {
  // update Algolia search indices on production builds
  indexAlgolia(algoliaConfig)
}

// signup pages exhibit SSR errors, we somehow get duplicate DOM nodes
// maybe because they're generated from objects with referential inequality
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    ssr: !event.url.pathname.startsWith(`/signup`),
  })
