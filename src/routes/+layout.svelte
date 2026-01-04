<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import { browser } from '$app/environment'
  import { Footer, Header } from '$lib'
  import { colorMode, microcopy } from '$lib/stores'
  import type { Snippet } from 'svelte'
  import type { NavLink, Link } from '$lib/types'
  import '../app.css'

  interface Props {
    data: {
      nav: NavLink[]
      footer: { links: Link[] }
      social: Record<string, string>
    }
    children: Snippet
  }

  const { data, children }: Props = $props()

  afterNavigate(() => {
    // Track user navigation across the site. This data is transferred to Airtable
    // by the signup form or destroyed when they leave the site.
    if (!window.visitedPages) window.visitedPages = [document.referrer]
    window.visitedPages.push(location.pathname + location.search)
  })

  // Sync data-theme attribute when colorMode changes (for client-side theme switching)
  $effect(() => {
    if (browser) {
      document.documentElement.setAttribute('data-theme', $colorMode)
    }
  })
</script>

<!-- Moved these here, from app.html, so these parameter can get different attributes for each site -->
<svelte:head>
  <title>{$microcopy?.meta?.name}</title>
  <meta name="author" content={$microcopy?.meta?.name} />
  <meta name="description" content={$microcopy?.meta?.description} />
  <script defer data-domain={$microcopy?.meta?.url} src="/js/script.js"></script>

  <meta name="color-scheme" content={$colorMode || `system`} />
</svelte:head>

<Header nav={data.nav} />
<main>
  {@render children()}
</main>
<Footer links={data.footer.links} social={data.social} />
