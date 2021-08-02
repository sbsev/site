<script lang="ts" context="module">
  import { fetchPage } from '../utils/queries'

  export async function load({
    page: { params },
  }: LoadInput): Promise<LoadOutput | undefined> {
    const page = await fetchPage(params.slug)

    // If no page data could be fetched for params.slug, the page doesn't exist,
    // so we fall through to src/routes/__error.svelte.
    if (!page) return

    return { props: { page } }
  }
</script>

<script lang="ts">
  import BasePage from '../components/BasePage.svelte'

  import type { LoadInput, LoadOutput } from '@sveltejs/kit'

  import type { Page } from '../types'

  export let page: Page
</script>

<BasePage {page} />
