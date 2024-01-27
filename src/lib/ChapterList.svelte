<script lang="ts">
  import Icon from '@iconify/svelte'
  import { microcopy } from './stores'
  import type { Chapter } from './types'

  export let chapters: Chapter[]

  const openChapters = chapters.filter((ch) => ch.acceptsSignups)
  const startingChapters = chapters.filter((ch) => ch.status == `starting`)
  const partnerChapters = chapters.filter((ch) => ch.status == `partner`)
</script>

<h1>
  <Icon icon={$microcopy?.icons?.global?.place} inline />
  {$microcopy?.chapterList?.locations}
</h1>
<ol>
  {#each openChapters as { title, slug }}
    <li><a href={slug}>{title}</a></li>
  {/each}
</ol>
{#if startingChapters.length > 2}
  <h1>
    <Icon icon={$microcopy?.icons?.pages?.chapterList?.construction} inline />
    {$microcopy?.chapterList?.inSetup}
  </h1>
  <ol>
    {#each startingChapters as { title, slug }}
      <li><a href={slug}>{title}</a></li>
    {/each}
  </ol>
{/if}
{#if partnerChapters.length > 2}
  <h1>
    <Icon icon={$microcopy?.icons?.global?.place} inline />
    {$microcopy?.chapterList?.partner}
  </h1>
  <ol>
    {#each partnerChapters as { title, slug }}
      <li><a href={slug}>{title}</a></li>
    {/each}
  </ol>
{/if}

<style>
  h1 {
    margin-top: 2em;
  }
  ol {
    max-width: 45em;
    margin: 2em auto 4em;
    columns: 3;
    padding-left: 3em;
  }
  @media (max-width: 600px) {
    ol {
      columns: 2;
    }
  }
  ol li {
    padding: 3pt 1ex;
  }
</style>
