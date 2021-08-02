<script lang="ts" context="module">
  import { fetchYaml, fetchChapters } from '../utils/queries.js'

  export async function load(): Promise<LoadOutput> {
    const nav = await fetchYaml(`Nav`)
    const footer = await fetchYaml(`Footer`)
    const social = await fetchYaml(`Social`)
    const chapters = await fetchChapters()

    // ensure the non-chapter link spans all chapter subnav columns
    nav.find((el: NavLink) => el.url === `/standorte`).subNav[0].spanCols = true

    // create { title, url } array containing all chapters
    const chapterLinks = chapters.map((chapter: Chapter) => {
      const { title, slug, acceptsSignups } = chapter
      return { title, url: slug, lightFont: !acceptsSignups }
    })

    // prepend chapter links into chapter subnav
    nav.find((el: NavLink) => el.url === `/standorte`).subNav.unshift(...chapterLinks)

    return { props: { nav, footer, social } }
  }
</script>

<script lang="ts">
  import { page } from '$app/stores'

  import Header from '../components/Header.svelte'
  import Footer from '../components/Footer.svelte'
  import type { Chapter, NavLink } from '../types.js'
  import type { LoadOutput } from '@sveltejs/kit'

  export let nav: NavLink[]
  export let footer: { links: string[] }
  export let social: Record<string, string>

  if (typeof window !== `undefined`) {
    page.subscribe(() => {
      // Track user navigation across the site. This data is transferred to Airtable
      // by the signup form or destroyed when they leave the site.
      if (!window.locations) window.locations = [document.referrer]
      window.locations.push(location.pathname + location.search)
    })
  }
</script>

<svelte:head>
  <!-- see _redirects file for where this script originates -->
  <script defer data-domain="studenten-bilden-schueler.de" src="/js/script.js"></script>
  <!-- required for triggering custom events in signup form -->
  <script lang="ts">
    window.plausible =
      window.plausible ||
      function () {
        ;(window.plausible.q = window.plausible.q || []).push(arguments)
      }
  </script>
</svelte:head>

<Header {nav} />
<main>
  <slot />
</main>
<Footer links={footer.links} {social} />
