<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import { Footer, Header } from '$lib'
  import { colorMode, microcopy } from '$lib/stores'
  import '../app.css'

  export let data
  $: ({ nav, footer, social } = data)

  afterNavigate(() => {
    // Track user navigation across the site. This data is transferred to Airtable
    // by the signup form or destroyed when they leave the site.
    if (!window.visitedPages) window.visitedPages = [document.referrer]
    window.visitedPages.push(location.pathname + location.search)
  })
</script>

<!-- Moved these here, from app.html, so these parameter can get different attributes for each site -->
<svelte:head>
  <title>{$microcopy?.meta?.name}</title>
  <meta name="author" content={$microcopy?.meta?.name} />
  <meta name="description" content={$microcopy?.meta?.description} />
  <script defer data-domain={$microcopy?.meta?.url} src="/js/script.js"></script>

  <meta name="color-scheme" content={$colorMode} />
  <link rel="stylesheet" href="/{$colorMode}-theme.css" />
</svelte:head>

<Header {nav} />
<main>
  <slot />
</main>
<Footer links={footer.links} {social} />
