<script context="module">
  import { fetchJson, fetchPage, fetchChapters } from '../utils/queries'

  export async function preload({ path }, session) {
    const nav = await fetchJson(`Nav`, session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    const page = (await fetchPage(path.substring(1), session.gqlUri)) || {}

    nav.data.nav.find((el) => el.url === `/standorte`).subNav[0].span = true
    nav.data.nav
      .find((el) => el.url === `/standorte`)
      .subNav.unshift(...chapters.map((el) => ({ ...el, url: `/standorte/` + el.slug })))

    return { nav: nav.data.nav, page }
  }
</script>

<script>
  import Header from '../components/Header.svelte'
  import Footer from '../components/Footer.svelte'
  import 'cross-fetch/polyfill'

  export let nav, page
  const { title } = page
</script>

<svelte:head>
  <title>SbS{title ? ` - ${title}` : ``}</title>
</svelte:head>

<Header {nav} />
<main>
  <slot />
</main>
<Footer />
