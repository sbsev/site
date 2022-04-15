<script lang="ts" context="module">
  import BasePage from '$src/components/BasePage.svelte'
  import ChapterList from '$src/components/ChapterList.svelte'
  import ChapterMap from '$src/components/ChapterMap.svelte'
  import { fetchChapters, fetchPage } from '$src/fetch'
  import type { Chapter, Page } from '$src/types'
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async ({ url }) => {
    const page = await fetchPage(url.pathname.split(`/`).filter(Boolean).join(`/`))
    const chapters = await fetchChapters()

    return {
      props: { page, chapters },
    }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let page: Page
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
