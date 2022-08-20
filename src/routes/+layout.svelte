<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import '../app.css'
  import Footer from '../components/Footer.svelte'
  import Header from '../components/Header.svelte'
  import { microcopy } from '../stores'
  import type { LayoutData } from './$types'

  export let data: LayoutData
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
  <!-- see netlify.toml file for where this script originates -->
  <script defer data-domain={$microcopy?.meta?.url} src="/js/script.js"></script>
</svelte:head>

<Header {nav} />
<main>
  <slot />
</main>
<Footer links={footer.links} {social} />
