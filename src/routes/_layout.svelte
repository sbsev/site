<script context="module">
  import { fetchJson, fetchPage, fetchChapters } from '../utils/queries'

  export async function preload({ path }, session) {
    const { nav } = await fetchJson(`Nav`, session.gqlUri)
    const footer = await fetchJson(`Footer`, session.gqlUri)
    const social = await fetchJson(`Social`, session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    const pageData = (await fetchPage(path.substring(1), session.gqlUri)) || {}

    nav.find((el) => el.url === `/standorte`).subNav[0].span = true
    nav
      .find((el) => el.url === `/standorte`)
      .subNav.unshift(...chapters.map((el) => ({ ...el, url: el.slug })))

    return { nav, pageData, footer, social }
  }
</script>

<script>
  import Update from '@svg-icons/material-sharp/update.svg'
  import { stores } from '@sapper/app'

  import Header from '../components/Header.svelte'
  import Footer from '../components/Footer.svelte'

  export let nav, pageData, footer, social

  const { page } = stores()

  if (typeof window !== `undefined`) {
    page.subscribe(() => {
      if (!window.locations) window.locations = [document.referrer]
      window.locations.push(location.pathname + location.search)
    })
  }

  const { title, sys } = pageData
</script>

<svelte:head>
  <title>SbS{title ? ` - ${title}` : ``}</title>
</svelte:head>

<Header {nav} />
<main>
  <slot />
  {#if sys?.publishedAt && !pageData.slug.includes(`blog`)}
    <time><Update
        height="3ex"
        style="vertical-align: bottom; padding-right: 4pt;" />Zuletzt bearbeitet:
      {new Date(sys?.publishedAt).toLocaleDateString(`de`)}</time>
  {/if}
</main>
<Footer links={footer.links} {social} />

<style>
  time {
    display: block;
    text-align: right;
    font-size: 0.6em;
    padding: 2em;
    text-align: center;
  }
</style>
