<script context="module">
  import { fetchPage } from '../utils/queries'

  export async function preload({ params }) {
    const page = await fetchPage(params.slug.join(`/`))
    return { page }
  }
</script>

<script>
  import BasePage from '../components/BasePage.svelte'
  export let page
</script>

<BasePage {page} />
