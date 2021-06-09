<script>
  import Update from '@svicons/material-sharp/update.svelte'

  import Img from '../components/Img.svelte'
  import Toc from '../components/Toc.svelte'

  export let page

  $: ({ title, slug, cover, body, toc, yaml, sys } = page || {})
  $: date = new Date(sys?.publishedAt).toLocaleDateString(`de`)
  const style = `height: 3ex; vertical-align: bottom; padding-right: 4pt;`
</script>

<svelte:head>
  <title>{title ? `${title} - SbS` : `SbS`}</title>
  <meta name="date" content={date} />
</svelte:head>

<figure>
  <Img {...cover} imgStyle="height: 100%" />
  {#if $$slots.title}
    <slot name="title" />
  {:else if title}
    <h1>{title}</h1>
  {/if}
  {#if yaml?.caption}
    <figcaption>{@html yaml.caption}</figcaption>
  {/if}
</figure>
{#if toc}
  <Toc />
{/if}
<slot />
<article>
  {@html body}
  <slot name="afterBody" />
</article>

<slot name="afterArticle" />

{#if sys?.publishedAt && !slug.includes(`blog`)}
  <time>
    <Update {style} />Zuletzt bearbeitet:
    {date}</time>
  <address>
    <a href="mailto:it@studenten-bilden-schueler.de?subject=Feedback zu Seite: {title}"
      >Feedback zu dieser Seite?</a>
  </address>
{/if}

<style>
  article {
    max-width: 45em;
    padding: 1em;
    margin: auto;
  }
  figure {
    position: relative;
    overflow: hidden;
    height: calc(25em + 3vw);
    max-height: 65vh;
    margin: 0;
  }
  figure > h1 {
    color: white;
    background: rgba(0, 0, 0, 0.6);
    padding: 1pt 1ex;
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
  figcaption {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 1px;
    background: rgba(0, 0, 0, 0.7);
    padding: 0 8pt;
    border-radius: 4pt 4pt 0 0;
    color: white;
    margin: 0 10px;
    text-align: center;
  }
  figcaption :global(a) {
    color: var(--lightBlue);
  }
  time {
    display: block;
    font-size: 1ex;
    margin: 8em 2em 2em;
    text-align: center;
  }
  address {
    text-align: center;
    font-size: 1.3ex;
    font-style: normal;
    margin: 2em;
  }
</style>
