<script context="module">
  import { fetchChapters, fetchPage } from '../../utils/queries'

  export async function preload({ path }, session) {
    const page = await fetchPage(path.substring(1), session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
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
