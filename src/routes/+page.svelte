<script lang="ts">
  import { ChapterMap } from '$lib'
  import { microcopy } from '$lib/stores'
  import Icon from '@iconify/svelte'

  export let data

  const style = `margin-right: 5pt;`
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
  <div style="background: var(--light-blue);">
    <span>{data.chapters.filter((ch) => ch.status == `active`).length}</span>
    <strong>
      <Icon inline icon="ic:place" {style} />
      {$microcopy?.indexPage?.boxes?.locationsName}</strong
    >
  </div>
  <div style="background: var(--green);">
    <span>{$microcopy?.indexPage?.boxes?.studentsNumber}</span>
    <strong>
      <Icon inline icon="fa-solid:user-graduate" {style} />
      {$microcopy?.indexPage?.boxes?.studentsName}</strong
    >
  </div>
  <div style="background: var(--orange);">
    <span>{$microcopy?.indexPage?.boxes.pupilsNumber}</span>
    <strong>
      <Icon inline icon="fa-solid:child" {style} />
      {$microcopy?.indexPage?.boxes?.pupilsName}</strong
    >
  </div>
  <div style="background: var(--green);">
    <span>{$microcopy?.indexPage?.boxes?.scholarshipNumber}</span>
    <strong>
      <Icon inline icon="fa-solid:user-graduate" {style} />
      {@html $microcopy?.indexPage?.boxes?.scholarshipName}
    </strong>
  </div>
  <div style="background: var(--light-blue);">
    <span>{$microcopy?.indexPage?.boxes?.organizationMemberNumber}</span>
    <strong>
      <Icon inline icon="fa6-solid:user-group" {style} />
      {@html $microcopy?.indexPage?.boxes?.organizationMemberName}
    </strong>
  </div>
</section>

<h2>
  <!-- choose on map -->
  {@html $microcopy?.indexPage?.chooseLocation}
</h2>

<ChapterMap chapters={data.chapters} />

<h2>
  <!-- register now -->
  {@html $microcopy?.indexPage?.register}
</h2>

<article>
  {@html data.page.body}
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
