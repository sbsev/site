<script>
  export let chapters
</script>

<ol>
  {#each chapters as { title, slug }}
    <li><a href={slug}>{title}</a></li>
  {/each}
</ol>

<style>
  ol {
    max-width: 45em;
    margin: 2em auto;
    columns: 3;
    padding-left: 3em;
  }
  @media (max-width: 600px) {
    ol {
      columns: 2;
    }
  }
  ol li {
    padding-left: 1ex;
  }
</style>
