<script>
  export let src, alt, style

  import IntersectionObserver from './IntersectionObserver.svelte'

  let loaded = false
  let img
  $: if (img) loaded = true
</script>

<IntersectionObserver once let:intersecting>
  {#if intersecting}<img {src} {alt} {style} class:loaded bind:this={img} />{/if}
</IntersectionObserver>

<style>
  img {
    width: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }
  img.loaded {
    opacity: 1;
  }
</style>
