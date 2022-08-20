<script lang="ts">
  import BasePage from '../../components/BasePage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ page } = data)
</script>

<BasePage {page} />
