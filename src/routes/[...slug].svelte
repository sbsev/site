<script context="module">
  import { fetchPage } from '../utils/queries'

  export async function load({ page: { params } }) {
    const page = await fetchPage(params.slug)

    // If no page data could be fetched for params.slug, the page doesn't exist,
    // so we fall through to src/routes/__error.svelte.
    if (!page) return

    return { props: { page } }
  }
</script>

<script>
  import BasePage from '../components/BasePage.svelte'

  export let page
</script>

<BasePage {page} />
