<script lang="ts">
  import BasePage from '$lib/BasePage.svelte'
  import ChapterList from '$lib/ChapterList.svelte'
  import ChapterMap from '$lib/ChapterMap.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ chapters, page } = data)
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
