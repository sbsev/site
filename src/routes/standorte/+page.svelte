<script lang="ts">
  import { BasePage, ChapterList, ChapterMap } from '$lib'

  const { data } = $props()
  const { chapters, page } = data
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
