<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import Child from '~icons/fa-solid/child'
  import UserGraduate from '~icons/fa-solid/user-graduate'
  import Place from '~icons/ic/place'
  import ChapterMap from '../components/ChapterMap.svelte'
  import { fetchChapters, fetchPage } from '../fetch'
  import type { Chapter, Page } from '../types'

  export const load: Load = async () => {
    const page = await fetchPage(`/`)
    const chapters = await fetchChapters()

    // const { students, pupils } = await airtableFetch(
    //   `{
    //     students: studentenStatistiken {
    //       id
    //     }
    //     pupils: schuelerStatistiken {
    //       id
    //     }
    //   }`,
    //   { cache: `force-cache` }
    // )
    return { props: { page, chapters } }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let page: Page

  const style = `vertical-align: text-top; margin-right: 5pt;`
</script>

<h1>
  <img src="/name.svg" alt="Studenten bilden Schüler" width="1924px" height="163px" />
</h1>

<svelte:head>
  <title>Studenten bilden Schüler e.V. - Startseite</title>
</svelte:head>

<h2>
  Kostenlose Nachhilfe von ehrenamtlichen Studierenden für finanziell benachteiligte
  Kinder
</h2>

<section style="white-space: nowrap;">
  <div style="background: var(--lightBlue);">
    <span>{chapters.filter((ch) => ch.acceptsSignups).length}</span>
    <strong><Place {style} />Standorte</strong>
  </div>
  <div style="background: var(--green);">
    <span>2872</span>
    <strong><UserGraduate {style} />Studierende</strong>
  </div>
  <div style="background: var(--orange);">
    <span>3186</span>
    <strong><Child {style} />Schüler:innen</strong>
  </div>
  <div style="background: var(--lightBlue);">
    <span>6</span>
    <strong>
      <UserGraduate {style} />
      <a style="color: white;" sveltekit:prefetch href="/stipendium"> Stipendien </a>
    </strong>
  </div>
</section>

<h2>
  Wähle deinen <a sveltekit:prefetch href="/standorte"><strong>Standort</strong></a> auf der
  Karte!
</h2>

<ChapterMap {chapters} />

<h2>
  Oder melde dich direkt <a sveltekit:prefetch href="/signup-student">
    <strong>bei uns an.</strong>
  </a>
</h2>

<article>
  {@html page.body}
</article>

<style>
  h1 img {
    margin: 3ex auto;
    display: block;
    width: 92vw;
    max-width: 650pt;
    height: auto;
  }
  h2 {
    margin-top: 2em;
    text-align: center;
    font-weight: lighter;
  }
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
    display: flex;
    flex-direction: column;
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
