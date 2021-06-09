<script>
  import Img from './Img.svelte'

  export let hit
  export let clickHandler = () => {}

  $: ({ title, slug, body, cover = {}, date, author } = hit)
</script>

<div>
  {#if cover.src}
    <a sveltekit:prefetch href={slug} on:click={clickHandler}>
      <Img {...cover} sizes={[{ w: 150 }]} />
    </a>
  {/if}
  <h3>
    <a sveltekit:prefetch href={slug} on:click={clickHandler}>{@html title}</a>
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
    border-radius: 5pt;
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
  div :global(picture) {
    float: right;
    border-radius: 2pt;
    margin: 1ex 0 1ex 1ex;
    overflow: hidden;
  }
</style>
