<script lang="ts">
  import Icon from '@iconify/svelte'
  import Toc from 'svelte-toc'
  import Img from './Img.svelte'
  import { microcopy } from './stores'
  import type { Page } from './types'

  export let page: Page

  $: ({ title, slug, cover, body, toc, yaml, sys } = page)
  $: date = new Date(sys?.publishedAt).toLocaleDateString(`de`)
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
<slot />
<article>
  {#if toc}
    <Toc
      title=""
      openButtonLabel="Inhaltsverzeichnis öffnen"
      headingSelector="article :is(h2, h3, h4)"
      --toc-mobile-bg="var(--bodyBg)"
    />
  {/if}
  <div>
    {@html body}
    <slot name="afterBody" />
  </div>
</article>

<slot name="afterArticle" />

{#if sys?.publishedAt && !slug.includes(`blog`)}
  <time>
    <Icon
      icon="ic:update"
      width="1.3em"
      style="padding: 0 4pt; vertical-align: middle;"
    />
    {$microcopy?.basepage?.lastUpdated}
    {date}
  </time>
  <address>
    <a href="mailto:{$microcopy?.basepage?.email} {title}">
      {$microcopy?.basepage?.feedback}
    </a>
  </address>
{/if}

<style>
  article {
    max-width: 55em;
    padding: 1em;
    margin: auto;
    display: flex;
    gap: 1em;
  }
  article > div {
    width: 100%;
  }
  article > :global(aside) {
    flex: 30%;
  }
  article :global(:where(h2, h3, h4, h5, h6)) {
    transition: 0.3s;
  }
  article :global(.toc-clicked) {
    color: var(--lightBlue);
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
    box-sizing: border-box;
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
    font-size: 1.5ex;
    font-style: normal;
    margin: 2em;
  }
</style>
