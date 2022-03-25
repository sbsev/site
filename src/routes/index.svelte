<script lang="ts" context="module">
  import Child from '@svicons/fa-solid/child.svelte'
  import UserGraduate from '@svicons/fa-solid/user-graduate.svelte'
  import Place from '@svicons/material-sharp/place.svelte'
  import ChapterMap from '../components/ChapterMap.svelte'
  import type { Chapter, Page } from '../types'
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let page: Page
  export let counts: { [key: string]: number }
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

<section>
  <div style="background: var(--lightBlue);">
    <span>{chapters.filter((ch) => ch.acceptsSignups).length}</span>
    <Place height="2.5ex" style="vertical-align: middle;" />Standorte
  </div>
  <div style="background: var(--green);">
    <span>{counts.students}</span>
    <UserGraduate height="2.5ex" style="vertical-align: middle;" />Studierende
  </div>
  <div style="background: var(--orange);">
    <span>{counts.pupils}</span>
    <Child height="2.5ex" style="vertical-align: middle;" />Schüler:innen
  </div>
  <div style="background: var(--lightBlue);">
    <span>3</span>
    <UserGraduate height="2.5ex" style="vertical-align: middle;" />Stipendien
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
