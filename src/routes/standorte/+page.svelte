<script lang="ts">
  import { BasePage, ChapterList, ChapterMap } from '$lib'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ chapters, page } = data)
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
