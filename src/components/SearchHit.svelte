<script>
  export let hit
  export let clickHandler = () => {}

  $: ({ title, slug, body, cover, date, author } = hit)
</script>

<div>
  {#if cover}
    <a href={slug}><img src="{cover.src}?w=100&q=80" alt={cover.alt || cover.title} /></a>
  {/if}
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
</div>

<style>
  div {
    background: var(--accentBg);
    padding: 1ex 1em;
    border-radius: 1ex;
    margin: 1em 0;
  }
  div > h3 {
    margin-top: 0;
  }
  div > p {
    margin-bottom: 0;
  }
  h3 :global(em) {
    color: white;
  }
  img {
    float: right;
    border-radius: 5pt;
    margin-top: 2ex;
  }
</style>
