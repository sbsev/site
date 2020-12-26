<script>
  export let hit
  export let clickHandler = () => {}

  const { title, slug, body, cover, date, author } = hit
</script>

{#if cover}<img src={cover.url + `?w=100`} alt={cover.description} />{/if}
<h3>
  <a href={slug} on:click={clickHandler}>{@html title}</a>
</h3>
{#if date}<span>{new Date(date).toLocaleDateString(`de`)}</span>{/if}
{#if author}<span>{author.name}</span>{/if}
{#if body}
  <p>
    {@html body}
  </p>
{/if}

<style>
  h3 :global(em) {
    color: white;
  }
  img {
    float: right;
    border-radius: 5pt;
    margin-top: 2ex;
  }
</style>
