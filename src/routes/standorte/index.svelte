<script context="module">
  import { fetchChapters, fetchPage } from '../../utils/queries'

  export async function preload({ path }, session) {
    const page = await fetchPage(path.substring(1), session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    return { page, chapters }
  }
</script>

<script>
  import marked from 'marked'
  import ChapterMap from '../../components/ChapterMap.svelte'
  import ChapterList from '../../components/ChapterList.svelte'

  export let chapters, page
  const { subtitle, cover = {}, body = `` } = page
</script>

<ChapterMap {chapters} />
<ChapterList {chapters} />
<hgroup>
  <img src={cover.url} alt={cover.description} />
  <h1>
    {@html subtitle}
  </h1>
</hgroup>
<div>
  {@html marked(body)}
</div>

<style>
  div {
    max-width: 45em;
    padding: 2em;
    margin: auto;
  }
  hgroup {
    position: relative;
    max-height: 20em;
    overflow: hidden;
  }
  hgroup img {
    width: 100%;
  }
  h1 {
    font-weight: lighter;
    background: rgba(0, 0, 0, 0.6);
    padding: 5pt 1ex;
    border-radius: 6pt;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: min-content;
    white-space: nowrap;
  }
</style>
