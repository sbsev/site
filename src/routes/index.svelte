<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import Child from '@svicons/fa-solid/child.svelte'
  import UserGraduate from '@svicons/fa-solid/user-graduate.svelte'
  import Place from '@svicons/material-sharp/place.svelte'
  import ChapterMap from '../components/ChapterMap.svelte'
  import type { Chapter, Page } from '../types'
  import { fetchChapters, fetchPage, fetchYaml } from '../utils/queries'

  export const load: Load = async () => {
    const page = await fetchPage(`/`)
    const chapters = await fetchChapters()
    const smallTexts = await fetchYaml(`smallTexts`)


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
    return { props: { page, chapters, smallTexts} }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let page: Page
  export let smallTexts

  let windowWidth: number

  $: nImages = windowWidth > 1100 ? 7 : windowWidth < 600 ? 3 : 6
</script>

<h1>
  <img src="/name.svg" alt="Studenten bilden Schüler" width="1924px" height="163px" />
</h1>

<svelte:head>
  <!-- <title>Studenten bilden Schüler e.V. - Startseite</title> -->
  <title>{smallTexts["indexPage"]["name"]}</title>
</svelte:head>

<svelte:window bind:innerWidth={windowWidth} />

<h2>
  {smallTexts["indexPage"]["theme"]}
  <!-- Kostenlose Nachhilfe von ehrenamtlichen Studierenden für finanziell benachteiligte
  Kinder -->
</h2>

<section>
  <div style="background: var(--lightBlue);">
    <span>{chapters.filter((ch) => ch.acceptsSignups).length}</span>
    <Place height="2.5ex" style="vertical-align: middle;" />{smallTexts["indexPage"]["boxes"]["locationsName"]}
  </div> 
  <div style="background: var(--green);">
    <span>{smallTexts["indexPage"]["boxes"]["studentsNumber"]}</span>
    <UserGraduate height="2.5ex" style="vertical-align: middle;" />{smallTexts["indexPage"]["boxes"]["studentsName"]}
  </div>
  <div style="background: var(--orange);">
    <span>{smallTexts["indexPage"]["boxes"]["pupilsNumber"]}</span>
    <Child height="2.5ex" style="vertical-align: middle;" />{smallTexts["indexPage"]["boxes"]["pupilsName"]}
  </div>
  <div style="background: var(--lightBlue);">
    <span>{smallTexts["indexPage"]["boxes"]["scholarshipNumber"]}</span>
    <UserGraduate height="2.5ex" style="vertical-align: middle;" />{smallTexts["indexPage"]["boxes"]["scholarshipName"]}
  </div> -->
</section>

<h2>
  <!-- Wähle deinen <a sveltekit:prefetch href="/standorte"><strong>Standort</strong></a> auf der
  Karte! -->
  {smallTexts["indexPage"]["chooseLocation"]}
</h2>

<ChapterMap {chapters} />

<h2>
  {smallTexts["indexPage"]["register"]}

  <!-- Oder melde dich direkt <a sveltekit:prefetch href="/signup-student">
    <strong>bei uns an.</strong>
  </a> -->
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
