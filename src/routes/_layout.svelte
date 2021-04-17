<script context="module">
  import { fetchYaml, fetchChapters } from '../utils/queries'

  export async function preload() {
    const nav = await fetchYaml(`Nav`)
    const footer = await fetchYaml(`Footer`)
    const social = await fetchYaml(`Social`)
    const chapters = await fetchChapters()

    // ensure the non-chapter link spans all chapter subnav columns
    nav.find((el) => el.url === `/standorte`).subNav[0].spanCols = true

    // create { title, url } array containing all chapters
    const chapterLinks = chapters.map((chapter) => {
      const { title, slug, acceptsSignups } = chapter
      return { title, url: slug, lightFont: !acceptsSignups }
    })
    // prepend chapter links into chapter subnav
    nav.find((el) => el.url === `/standorte`).subNav.unshift(...chapterLinks)

    return { nav, footer, social }
  }
</script>

<script>
  import { stores } from '@sapper/app'

  import Header from '../components/Header.svelte'
  import Footer from '../components/Footer.svelte'
  import GoogleAnalytics from '../components/GoogleAnalytics.svelte'

  export let nav, footer, social

  const { page } = stores()

  if (typeof window !== `undefined`)
    page.subscribe(() => {
      // Track user navigation across the site. This data is transferred to Airtable
      // by the signup form or destroyed when they leave the site.
      if (!window.locations) window.locations = [document.referrer]
      window.locations.push(location.pathname + location.search)
    })
</script>

<svelte:head>
  <script
    async
    defer
    data-domain="studenten-bilden-schueler.de"
    src="https://plausible.io/js/plausible.js"></script>
</svelte:head>
<GoogleAnalytics />

<Header {nav} />
<main>
  <slot />
</main>
<Footer {...footer} {social} />
