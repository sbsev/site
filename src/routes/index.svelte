<script context="module">
  import {
    fetchChapters,
    fetchPage,
    fetchPages,
    fetchPosts,
    fetchYaml,
    base64Thumbnail,
  } from '../utils/queries'

  export async function preload() {
    const page = await fetchPage(`/`)
    const pages = await fetchPages()
    const posts = await fetchPosts()
    const chapters = await fetchChapters()
    const yaml = await fetchYaml(`Landing Page`)
    for (const img of yaml?.images) {
      img.base64 = await base64Thumbnail(img.src)
    }

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
    return { page, chapters, yaml, pages, posts }
  }
</script>

<script>
  import ChapterMap from '../components/ChapterMap.svelte'
  import Place from '@svg-icons/material-sharp/place.svg'
  import UserGraduate from '@svg-icons/fa-solid/user-graduate.svg'
  import Child from '@svg-icons/fa-solid/child.svg'
  import Img from '../components/Img.svelte'

  export let chapters, page, yaml, pages, posts

  let windowWidth

  const style = `vertical-align: middle; margin-right: 6pt;`
  const textBgColors = [`green`, `orange`, `lightBlue`, `darkGreen`, `blue`]
  $: nImages = windowWidth > 1100 ? 7 : windowWidth < 600 ? 3 : 6
</script>

<!-- placed here so sapper crawls all pages and posts (won't be needed with svelte-kit) -->
<!-- https://stackoverflow.com/a/63388587 -->
<ul style="visibility: hidden; position: absolute;">
  {#each pages as { title, slug }}
    <a href={slug}>{title}</a>
  {/each}
  {#each posts as { title, slug }}
    <a href={slug}>{title}</a>
  {/each}
</ul>

<h1>Studenten bilden Schüler e.V.</h1>
<div class="grid">
  {#each yaml.images.slice(0, nImages) as img, idx}
    <Img
      {...img}
      width="400"
      height="300"
      sizes={[{ w: 400 }, { w: 800 }]}
      pictureStyle="grid-area: img{idx + 1};" />
  {/each}
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
    <span>1172</span>
    <UserGraduate height="2.5ex" {style} />Studierende
  </div>
  <div style="background: var(--orange);">
    <span>1286</span>
    <Child height="2.5ex" {style} />Schüler
  </div>
</section>

<h2>
  Wähle deinen <a sapper:prefetch href="/standorte"><strong>Standort</strong></a> auf der Karte!
</h2>

<ChapterMap {chapters} />

<article>
  {@html page.body}
</article>

<style>
  h1 {
    font-size: calc(1em + 2vw);
  }
  .grid {
    margin: 1em 2vw 2em;
    display: grid;
    grid-gap: 1ex;
    font-weight: bolder;
    grid-template-columns: repeat(11, 1fr);
    grid-auto-rows: 13em;
    grid-template-areas:
      '. img1 img1 img1 img1 txt2 txt2 img3 img3 img3 .'
      'img6 img6 img6 txt1 txt1 txt1 img2 img2 img2 img4 img4'
      '. . img7 img7 img7 txt3 txt3 img5 img5 img5 .';
  }
  @media (max-width: 1100px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: calc(10em + 6vw);
      grid-template-areas:
        'img1 txt1 img2'
        'txt2 img3 img4'
        'img5 img6 txt3';
    }
  }
  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'img1 txt1'
        'txt2 img2'
        'img3 txt3';
    }
  }
  .grid div {
    border-radius: 5pt;
    font-size: 2ex;
    display: flex;
    place-items: center;
    padding: 5pt 1em;
    color: white;
    font-size: calc(1em + 0.5vw);
  }
  .grid :global(img) {
    border-radius: 5pt;
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
