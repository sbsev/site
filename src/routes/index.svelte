<script context="module">
  import { fetchChapters, fetchPage } from '../utils/queries'

  export async function preload(_, session) {
    const page = await fetchPage(`/`, session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    return { page, chapters }
  }
</script>

<script>
  import ChapterMap from '../components/ChapterMap.svelte'
  import Place from '@svg-icons/material-filled/place.svg'
  import UserGraduate from '@svg-icons/fa-solid/user-graduate.svg'
  import Child from '@svg-icons/fa-solid/child.svg'

  export let chapters, page
</script>

<ChapterMap {chapters} />

<h1>Studenten bilden Schüler</h1>

<section>
  <div style="background: var(--lightBlue);">
    <span>{chapters.length}</span>
    <Place height="2.5ex" style="vertical-align: middle; margin-right: 6pt;" />Standorte
  </div>
  <div style="background: var(--green);">
    <span>1045</span>
    <UserGraduate
      height="2.5ex"
      style="vertical-align: middle; margin-right: 6pt;" />Studierende
  </div>
  <div style="background: var(--orange);">
    <span>1228</span>
    <Child height="2.5ex" style="vertical-align: middle; margin-right: 6pt;" />Schüler
  </div>
</section>

<article>
  {@html page.body}
</article>

<style>
  section {
    display: flex;
    padding: 1em;
    place-content: center;
    gap: 2em;
    flex-wrap: wrap;
    color: white;
  }
  section div {
    font-size: 2ex;
    text-align: center;
    flex: 0 1 10%;
    padding: 1ex;
    border-radius: 1ex;
    font-weight: bold;
  }
  section div span {
    font-size: 3ex;
    display: block;
  }
  article {
    padding: calc(1ex + 2vw);
    max-width: 40em;
    margin: auto;
  }
</style>
