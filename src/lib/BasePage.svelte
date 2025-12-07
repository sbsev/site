<script lang="ts">
  import Icon from '@iconify/svelte'
  import Toc from 'svelte-toc'
  import type { Snippet } from 'svelte'
  import { Img } from '.'
  import { microcopy } from './stores'
  import type { Page } from './types'

  interface Props {
    page: Page
    title?: Snippet
    children?: Snippet
    afterBody?: Snippet
    afterArticle?: Snippet
  }

  const {
    page,
    title: titleSlot,
    children,
    afterBody,
    afterArticle,
  } = $props<Props>()

  const pageTitle = $derived(page.title)
  const slug = $derived(page.slug)
  const cover = $derived(page.cover)
  const body = $derived(page.body)
  const toc = $derived(page.toc)
  const yaml = $derived(page.yaml)
  const sys = $derived(page.sys)
  const date = $derived(new Date(sys?.publishedAt).toLocaleDateString(`de`))

  // Type the microcopy store access
  const mc = $derived($microcopy as { basepage?: { lastUpdated?: string; email?: string; feedback?: string } })
</script>

<svelte:head>
  <title>{pageTitle ? `${pageTitle} - ST` : `ST`}</title>
  <meta name="date" content={date} />
</svelte:head>

<figure>
  <Img {...cover} img_style="height: 100%" />
  {#if titleSlot}
    {@render titleSlot()}
  {:else if pageTitle}
    <h1>{pageTitle}</h1>
  {/if}
  {#if yaml?.caption}
    <figcaption>{@html yaml.caption}</figcaption>
  {/if}
</figure>
{#if children}
  {@render children()}
{/if}
<article>
  {#if toc}
    <Toc
      title=""
      openButtonLabel="Inhaltsverzeichnis öffnen"
      headingSelector="article :is(h2, h3, h4)"
      --toc-mobile-bg="var(--body-bg)"
      --toc-min-width="10em"
      --toc-font-size="11pt"
      --toc-desktop-sticky-top="3em"
    />
  {/if}
  <div>
    {@html body}
    {#if afterBody}
      {@render afterBody()}
    {/if}
  </div>
</article>

{#if afterArticle}
  {@render afterArticle()}
{/if}

{#if sys?.publishedAt && !slug.includes(`blog`)}
  <time>
    <Icon
      icon="ic:update"
      width="1.3em"
      style="padding: 0 4pt; vertical-align: middle;"
    />
    {mc?.basepage?.lastUpdated}
    {date}
  </time>
  <address>
    <a href="mailto:{mc?.basepage?.email} {pageTitle}">
      {mc?.basepage?.feedback}
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
  article > :global(aside > nav) {
    font-size: 9pt;
  }
  article :global(:where(h2, h3, h4, h5, h6)) {
    transition: 0.3s;
  }
  article :global(.toc-clicked) {
    color: var(--light-blue);
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
    color: var(--light-blue);
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
