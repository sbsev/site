<script lang="ts">
  import ChapterMap from '$lib/ChapterMap.svelte'
  import { microcopy } from '$lib/stores'
  import Child from '~icons/fa-solid/child'
  import UserGraduate from '~icons/fa-solid/user-graduate'
  import Place from '~icons/ic/place'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ chapters, page } = data)

  const style = `vertical-align: text-top; margin-right: 5pt;`
</script>

<!-- Shows image of name of german association if page is german. Otherwise shows name of association. -->
{#if $microcopy?.country == `de`}
  <h1>
    <img
      src="/logo-name.svg"
      alt="Studenten bilden Schüler"
      width="1924px"
      height="163px"
    />
  </h1>
{:else}
  <h1>
    {$microcopy?.indexPage?.title}
  </h1>
{/if}

<svelte:head>
  <title>{$microcopy?.indexPage?.title}</title>
</svelte:head>

<h2>
  {$microcopy?.indexPage?.theme}
</h2>

<section style="white-space: nowrap;">
  <div style="background: var(--lightBlue);">
    <span>{chapters.filter((ch) => ch.acceptsSignups).length}</span>
    <strong><Place {style} />{$microcopy?.indexPage?.boxes?.locationsName}</strong>
  </div>
  <div style="background: var(--green);">
    <span>{$microcopy?.indexPage?.boxes?.studentsNumber}</span>
    <strong><UserGraduate {style} />{$microcopy?.indexPage?.boxes?.studentsName}</strong>
  </div>
  <div style="background: var(--orange);">
    <span>{$microcopy?.indexPage?.boxes.pupilsNumber}</span>
    <strong><Child {style} />{$microcopy?.indexPage?.boxes?.pupilsName}</strong>
  </div>
  <div style="background: var(--lightBlue);">
    <span>{$microcopy?.indexPage?.boxes?.scholarshipNumber}</span>
    <strong>
      <UserGraduate {style} />
      {@html $microcopy?.indexPage?.boxes?.scholarshipName}
    </strong>
  </div>
</section>

<h2>
  <!-- choose on map -->
  {@html $microcopy?.indexPage?.chooseLocation}
</h2>

<ChapterMap {chapters} />

<h2>
  <!-- register now -->
  {@html $microcopy?.indexPage?.register}
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
