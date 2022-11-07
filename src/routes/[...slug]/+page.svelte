<script lang="ts">
  import BasePage from '$lib/BasePage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<BasePage page={data.page} />
