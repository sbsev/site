<script>
  export let chapters

  import Place from '@svg-icons/material-sharp/place.svg'
  import Construction from '@svg-icons/material-sharp/construction.svg'

  const openChapters = chapters.filter((ch) => ch.acceptsSignups)
  const startingChapters = chapters.filter((ch) => !ch.acceptsSignups)

  const style = `vertical-align: -4pt;`
</script>

<h1>
  <Place height="2.2ex" {style} />
  Unsere Standorte
</h1>
<ol>
  {#each openChapters as { title, slug }}
    <li><a sapper:prefetch href={slug}>{title}</a></li>
  {/each}
</ol>
{#if startingChapters.length > 2}
  <h1>
    <Construction height="2.2ex" {style} />
    Standorte in Gründung
  </h1>
  <ol>
    {#each startingChapters as { title, slug }}
      <li><a sapper:prefetch href={slug}>{title}</a></li>
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
