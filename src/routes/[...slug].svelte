<script context="module">
  import { fetchPage } from '../utils/queries'

  export async function load({ page: { params } }) {
    const page = await fetchPage(params.slug)

    return { props: { page } }
  }
</script>

<script>
  import BasePage from '../components/BasePage.svelte'

  export let page
</script>

<BasePage {page} />
