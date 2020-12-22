<script context="module">
  import { fetchJson, fetchPage, fetchChapters } from '../utils/queries'

  export async function preload({ path }, session) {
    const { nav } = await fetchJson(`Nav`, session.gqlUri)
    const footer = await fetchJson(`Footer`, session.gqlUri)
    const social = await fetchJson(`Social`, session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    const page = (await fetchPage(path.substring(1), session.gqlUri)) || {}

    nav.find((el) => el.url === `/standorte`).subNav[0].span = true
    nav
      .find((el) => el.url === `/standorte`)
      .subNav.unshift(...chapters.map((el) => ({ ...el, url: `/standorte/` + el.slug })))

    return { nav, page, footer, social }
  }
</script>

<script>
  import Header from '../components/Header.svelte'
  import Footer from '../components/Footer.svelte'

  export let nav, page, footer, social

  const { title } = page
</script>

<svelte:head>
  <title>SbS{title ? ` - ${title}` : ``}</title>
</svelte:head>

<Header {nav} />
<main>
  <slot />
</main>
<Footer links={footer.links} {social} />
