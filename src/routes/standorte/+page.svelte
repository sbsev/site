<script lang="ts">
  import BasePage from '$src/lib/BasePage.svelte'
  import ChapterList from '$src/lib/ChapterList.svelte'
  import ChapterMap from '$src/lib/ChapterMap.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ chapters, page } = data)
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
