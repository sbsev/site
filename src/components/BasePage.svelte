<script>
  import Img from '../components/Img.svelte'
  import Toc from '../components/Toc.svelte'

  export let page

  $: ({ title, cover = {}, body = ``, toc } = page)
  $: ({ src, alt, base64 } = cover)
</script>

<hgroup>
  <Img {src} {alt} {base64} />
  {#if $$slots.title}
    <slot name="title" />
  {:else}
    <h1>{title}</h1>
  {/if}
</hgroup>
<slot />
<article>
  {#if toc}
    <Toc />
  {/if}
  {@html body}
</article>

<style>
  article {
    max-width: 42em;
    padding: 1em;
    margin: auto;
  }
  hgroup {
    position: relative;
    overflow: hidden;
  }
  hgroup > :global(*:not(:first-child)) {
    color: white;
    background: rgba(0, 0, 0, 0.6);
    padding: 5pt 1ex;
    border-radius: 1ex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50% - 1em), -50%);
    text-align: center;
    margin: 0 1em;
    width: max-content;
    max-width: 80vw;
  }
</style>
