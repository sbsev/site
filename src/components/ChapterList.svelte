<script>
  export let chapters
  import Place from '@svg-icons/material-sharp/place.svg'
</script>

<h1>
  <Place height="1em" style="vertical-align: -5pt;" />
  Unsere Standorte
</h1>
<ol>
  {#each chapters as { title, slug }}
    <li><a sapper:prefetch href={slug}>{title}</a></li>
  {/each}
</ol>

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
