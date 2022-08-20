<script lang="ts">
  import BasePage from '$src/components/BasePage.svelte'
  import ChapterList from '$src/components/ChapterList.svelte'
  import ChapterMap from '$src/components/ChapterMap.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ chapters, page } = data)
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
