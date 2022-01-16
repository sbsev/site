<script>
  export let links = []
  export let style = ``
  export let current
</script>

<div {style}>
  {#each links as { title, slug }}
    <a href={slug} aria-current={slug === current} sveltekit:prefetch>{title}</a>
  {/each}
</div>

<style>
  div {
    display: flex;
    border-radius: 1ex;
    width: max-content;
    overflow: hidden;
    height: fit-content;
  }
  a {
    cursor: pointer;
    display: inline-block;
    color: white;
    padding: 1ex 1em;
    background: var(--green);
    transition: 0.3s;
  }
  a:hover {
    background: var(--lightGreen);
    transform: scale(1.03);
  }
  a[aria-current] {
    box-shadow: inset 0 0 1em -3pt black;
    background: var(--darkGreen);
  }
</style>
