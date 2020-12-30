<script>
  import Img from '../components/Img.svelte'
  import Toc from '../components/Toc.svelte'

  export let page

  const { title, subtitle, cover = {}, body = ``, toc } = page
</script>

<hgroup>
  <Img {cover} />
  {#if $$slots.title}
    <slot name="title" />
  {:else}
    {#if title}
      <h1>{title}</h1>
    {/if}
    {#if subtitle}
      <h2>{subtitle}</h2>
    {/if}
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
    padding: 2em;
    margin: auto;
  }
  article :global(img) {
    width: 100%;
  }
  hgroup {
    position: relative;
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
  }
  hgroup > :global(h2) {
    font-weight: lighter;
  }
</style>
