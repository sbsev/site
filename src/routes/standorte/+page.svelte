<script lang="ts">
  import { BasePage, ChapterList, ChapterMap } from '$lib'

  const { data } = $props()
</script>

<ChapterMap chapters={data.chapters} />
<ChapterList chapters={data.chapters} />

<BasePage page={data.page}>
  {#snippet title()}
    <h2>🤗 Wir brauchen dich! 🤗</h2>
  {/snippet}
</BasePage>
