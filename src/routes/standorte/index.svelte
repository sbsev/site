<script lang="ts">
  import BasePage from '../../components/BasePage.svelte'
  import ChapterList from '../../components/ChapterList.svelte'
  import ChapterMap from '../../components/ChapterMap.svelte'
  import type { Chapter, Page } from '../../types'

  export let chapters: Chapter[]
  export let page: Page
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
