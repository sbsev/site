<script lang="ts">
  import { microcopy } from './stores'
  import type { Chapter } from './types'

  // Icon imports (bundled at build time)
  import IconPlace from '~icons/ic/place'
  import IconConstruction from '~icons/ic/round-construction'

  const { chapters } = $props<{ chapters: Chapter[] }>()

  const openChapters = $derived(Array.isArray(chapters) ? chapters.filter((ch) => ch.acceptsSignups) : [])
  const startingChapters = $derived(Array.isArray(chapters) ? chapters.filter((ch) => ch.status == `starting`) : [])
  const partnerChapters = $derived(Array.isArray(chapters) ? chapters.filter((ch) => ch.status == `partner`) : [])
</script>

<h1>
  <IconPlace style="display: inline; vertical-align: -0.125em;" />
  {$microcopy?.chapterList?.locations}
</h1>
<ol>
  {#each openChapters as { title, slug }}
    <li><a href={slug}>{title}</a></li>
  {/each}
</ol>
{#if startingChapters.length > 2}
  <h1>
    <IconConstruction style="display: inline; vertical-align: -0.125em;" />
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
    <IconPlace style="display: inline; vertical-align: -0.125em;" />
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
