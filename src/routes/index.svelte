<script context="module">
  import { fetchChapters, fetchPage, fetchYaml } from '../utils/queries'

  export async function preload() {
    const page = await fetchPage(`/`)
    const chapters = await fetchChapters()
    const yaml = await fetchYaml(`Landing Page`)
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
    return { page, chapters, yaml }
  }
</script>

<script>
  import ChapterMap from '../components/ChapterMap.svelte'
  import Place from '@svg-icons/material-sharp/place.svg'
  import UserGraduate from '@svg-icons/fa-solid/user-graduate.svg'
  import Child from '@svg-icons/fa-solid/child.svg'
  import Img from '../components/Img.svelte'

  export let chapters, page, yaml

  let windowWidth

  const style = `vertical-align: middle; margin-right: 6pt;`
  const sizes = [{ width: 400 }, { width: 800 }]
  const textBgColors = [`green`, `orange`, `lightBlue`, `darkGreen`, `blue`]
</script>

<div class="grid">
  {#each yaml.images.slice(0, windowWidth > 800 ? 7 : 3) as { src, alt }, idx}
    <Img {src} {alt} {sizes} pictureStyle="grid-area: img{idx + 1}" />
  {/each}
  <h1 style="grid-area: head;">Studenten bilden Schüler e.V.</h1>
  {#each Object.values(yaml.text) as text, idx}
    <div style="grid-area: txt{idx + 1}; background: var(--{textBgColors[idx]})">
      <span>{text}</span>
    </div>
  {/each}
</div>

<svelte:window bind:innerWidth={windowWidth} />

<h2>Wir fangen gerade erst an!</h2>

<section>
  <div style="background: var(--lightBlue);">
    <span>{chapters.length}</span>
    <Place height="2.5ex" {style} />Standorte
  </div>
  <div style="background: var(--green);">
    <span>996</span>
    <UserGraduate height="2.5ex" {style} />Studierende
  </div>
  <div style="background: var(--orange);">
    <span>761</span>
    <Child height="2.5ex" {style} />Schüler
  </div>
</section>

<h2>Wähle deinen <a href="/standorte"><strong>Standort</strong></a> auf der Karte!</h2>

<ChapterMap {chapters} />

<article>
  {@html page.body}
</article>

<style>
  .grid {
    margin: 2em 3vw;
    display: grid;
    grid-gap: 1ex;
    grid-template-columns: repeat(10, 1fr);
    grid-template-areas:
      '. img1 img1 head head head img2 img2 . .'
      '. img1 img1 . img3 img3 img2 img2 txt1 txt1'
      'img4 img4 txt2 txt2 img3 img3 img6 img6 img6 .'
      '. img5 img5 img7 img7 txt3 img6 img6 img6 .';
  }
  @media (max-width: 800px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
      grid-template-areas:
        'head head head'
        'img1 txt1 img2'
        'txt2 img3 txt3';
    }
  }
  @media (max-width: 500px) {
    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'head head'
        'img1 txt1'
        'txt2 img2'
        'img3 txt3';
    }
  }
  .grid div {
    border-radius: 1ex;
    font-size: 2ex;
    display: flex;
    place-items: center;
    padding: 5pt 1em;
    color: white;
    font-size: calc(1em + 0.5vw);
  }
  .grid :global(img) {
    border-radius: 1ex;
    height: 100%;
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
