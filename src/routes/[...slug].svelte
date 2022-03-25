<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import BasePage from '../components/BasePage.svelte'
  import type { Page } from '../types'
  import { fetchPage } from '../fetch'

  export const load: Load = async ({ params }) => {
    // delegate route to static/robots.txt
    // is this check necesary, will prob fallthorugh anyway
    if (params.slug === `robots.txt`) return { status: 404 }

    const page = await fetchPage(params.slug)

    // If no page data could be fetched for params.slug, the page doesn't exist,
    // so we fall through to src/routes/__error.svelte.
    if (!page) return { status: 404 }

    return { props: { page } }
  }
</script>

<script lang="ts">
  export let page: Page
</script>

<BasePage {page} />
