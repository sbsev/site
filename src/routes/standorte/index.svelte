<script context="module">
  import { fetchChapters, fetchPage } from '../../utils/queries'

  export async function preload({ path }) {
    const page = await fetchPage(path.split(`/`).filter(Boolean).join(`/`))
    const chapters = await fetchChapters()
    return { page, chapters }
  }
</script>

<script>
  import ChapterMap from '../../components/ChapterMap.svelte'
  import ChapterList from '../../components/ChapterList.svelte'
  import BasePage from '../../components/BasePage.svelte'

  export let chapters, page
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />

<BasePage {page}>
  <h2 slot="title">🤗 Wir brauchen dich! 🤗</h2>
</BasePage>
