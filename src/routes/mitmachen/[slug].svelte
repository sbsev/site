<script context="module">
  import { fetchPage } from '../../utils/queries'

  export async function preload({ path }) {
    const page = await fetchPage(path.split(`/`).filter(Boolean).join(`/`))
    return { page }
  }
</script>

<script>
  import BasePage from '../../components/BasePage.svelte'

  export let page
</script>

<BasePage {page} />
