<script context="module">
  import { fetchChapters, fetchPage } from './queries'

  export async function preload(_, session) {
    const page = await fetchPage(`/`, session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    return { page, chapters }
  }
</script>

<script>
  import marked from 'marked'
  import ChapterMap from '../components/ChapterMap.svelte'

  export let chapters, page
  const { cover = {}, body = `` } = page
</script>

<ChapterMap {chapters} />

<div>
  <h1>Studenten bilden Schüler</h1>
  <img src={cover.url} alt={cover.description} />
  {@html marked(body)}
</div>

<style>
</style>
