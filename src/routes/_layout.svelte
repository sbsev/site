<script context="module">
  import { fetchYaml, fetchPage, fetchChapters } from '../utils/queries'

  export async function preload({ path }) {
    const nav = await fetchYaml(`Nav`)
    const footer = await fetchYaml(`Footer`)
    const social = await fetchYaml(`Social`)
    const chapters = await fetchChapters()
    const pageData = (await fetchPage(path.substring(1) || `/`)) || {}

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

  export let nav, pageData, footer, social, segment

  const { page } = stores()

  if (typeof window !== `undefined`) {
    page.subscribe(() => {
      if (!window.locations) window.locations = [document.referrer]
      window.locations.push(location.pathname + location.search)
    })
  }

  $: ({ title, sys } = pageData)
  $: date = new Date(sys?.publishedAt).toLocaleDateString(`de`)
  const style = `height: 3ex; vertical-align: bottom; padding-right: 4pt;`
</script>

<svelte:head>
  <title>SbS{title ? ` - ${title}` : ``}</title>
  <meta name="description" content="Ehrenamtliche Nachhilfe von Studenten für Schüler" />
  <meta name="date" content={date} />
</svelte:head>

<Header {nav} />
<main>
  <slot />
  {#if sys?.publishedAt && !(segment ?? ``).includes(`blog`)}
    <time>
      <Update {style} />Zuletzt bearbeitet:
      {date}</time>
    <address>
      <a href="mailto:it@studenten-bilden-schueler.de?subject=Feedback zu Seite: {title}"
        >War diese Seite hilfreich?</a>
    </address>
  {/if}
</main>
<Footer {...footer} {social} />

<style>
  time {
    display: block;
    font-size: 1ex;
    margin: 2em;
    text-align: center;
  }
  address {
    text-align: center;
    font-size: 1.3ex;
    font-style: normal;
    margin: 2em;
  }
</style>
