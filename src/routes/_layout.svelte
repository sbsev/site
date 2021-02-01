<script context="module">
  import { fetchYaml, fetchChapters } from '../utils/queries'

  export async function preload() {
    const nav = await fetchYaml(`Nav`)
    const footer = await fetchYaml(`Footer`)
    const social = await fetchYaml(`Social`)
    const chapters = await fetchChapters()

    nav.find((el) => el.url === `/standorte`).subNav[0].span = true
    nav
      .find((el) => el.url === `/standorte`)
      .subNav.unshift(...chapters.map((el) => ({ ...el, url: el.slug })))

    return { nav, footer, social }
  }
</script>

<script>
  import { stores } from '@sapper/app'

  import Header from '../components/Header.svelte'
  import Footer from '../components/Footer.svelte'

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

<Header {nav} />
<main>
  <slot />
</main>
<Footer {...footer} {social} />
