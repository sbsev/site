<script lang="ts">
  import { BasePage, ChapterList, ChapterMap } from '$lib'

  const { data } = $props()
  const { chapters, page } = data
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  {#snippet title()}
    <h2>🤗 Wir brauchen dich! 🤗</h2>
  {/snippet}
</BasePage>
