<script lang="ts" context="module">
  import { fetchChapters, fetchPage } from '../../utils/queries'

  export async function load({ page: { path } }: LoadInput): Promise<LoadOutput> {
    const page = await fetchPage(path.split(`/`).filter(Boolean).join(`/`))
    const chapters = await fetchChapters()

    return {
      props: { page, chapters },
    }
  }
</script>

<script lang="ts">
  import type { LoadInput, LoadOutput } from '@sveltejs/kit'

  import type { Chapter, Page } from '../../types'

  import ChapterMap from '../../components/ChapterMap.svelte'
  import ChapterList from '../../components/ChapterList.svelte'
  import BasePage from '../../components/BasePage.svelte'

  export let chapters: Chapter[], page: Page
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
