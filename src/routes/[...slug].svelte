<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import BasePage from '../components/BasePage.svelte'
  import type { Page } from '../types'
  import { fetchPage } from '../utils/queries'

  export const load: Load = async ({ params }) => {
    // delegate route to static/robots.txt
    // is this check necesary, will prob fallthorugh anyway
    if (params.slug === `robots.txt`) return { fallthrough: true }

    const page = await fetchPage(params.slug)

    // If no page data could be fetched for params.slug, the page doesn't exist,
    // so we fall through to src/routes/__error.svelte.
    if (!page) return { fallthrough: true }

    return { props: { page } }
  }
</script>

<script lang="ts">
  export let page: Page
</script>

<BasePage {page} />
