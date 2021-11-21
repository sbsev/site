<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import BasePage from '../../components/BasePage.svelte'
  import ChapterList from '../../components/ChapterList.svelte'
  import ChapterMap from '../../components/ChapterMap.svelte'
  import type { Chapter, Page } from '../../types'
  import { fetchChapters, fetchPage } from '../../utils/queries'

  export const load: Load = async ({ page: { path } }) => {
    const page = await fetchPage(path.split(`/`).filter(Boolean).join(`/`))
    const chapters = await fetchChapters()

    return {
      props: { page, chapters },
    }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[], page: Page
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
