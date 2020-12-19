<script context="module">
  import { fetchPage } from '../utils/queries'

  export async function preload({ path }, session) {
    const page = await fetchPage(path.substring(1), session.gqlUri)
    return { page }
  }
</script>

<script>
  import BasePage from '../components/BasePage.svelte'
  export let page
</script>

<BasePage data={page} />
