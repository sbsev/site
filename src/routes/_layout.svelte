<script context="module">
  import { fetchJson, fetchPage, fetchChapters } from './queries'

  export async function preload({ path }, session) {
    const nav = await fetchJson(`Nav`, session.gqlUri)
    const chapters = await fetchChapters(session.gqlUri)
    const page = (await fetchPage(path.substring(1), session.gqlUri)) || {}

    nav.data.nav.find((el) => el.url === `/standorte`).subNav[0].span = true
    nav.data.nav.find((el) => el.url === `/standorte`).subNav.unshift(...chapters)

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

<style>
  main {
    width: 100vw;
  }
  main :global(h1) {
    text-align: center;
    color: var(--headingColor);
  }
  :global(body) {
    display: grid;
    min-height: 100vh;
    grid-template-rows: auto 1fr auto;
    margin: 0;
    background: var(--body-bg);
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    font-size: calc(1em + 0.5vw);
    transition: 0.3s;
    background: var(--bodyBg);
    color: var(--textColor);
  }
  :global(a) {
    color: var(--linkColor);
    text-decoration: none;
  }
  :global(a):hover {
    color: var(--hoverColor);
  }
  @media (min-width: 1600px) {
    :global(body) {
      font-size: 1.5em;
    }
  }
  :global(button) {
    background: transparent;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
  }
  :global(.multi-col-list ul) {
    display: grid;
    grid-gap: 0 2em;
    grid-template-columns: repeat(auto-fit, minmax(6em, 1fr));
  }
  :global(table) {
    border-collapse: collapse;
    width: 100%;
  }
  :global(table td),
  :global(table th) {
    border: 1px solid var(--textColor);
    padding: 0.4em 0.8em;
  }
  :global(tbody tr:nth-child(odd)) {
    background: var(--accentBg);
  }
  :global(div.scroll) {
    overflow: scroll;
    margin: 1em auto;
    border: 1px solid var(--textColor);
    border-width: 0 1px;
  }
  :global(main img) {
    max-width: 100%;
  }
  :global(section.grid) {
    display: grid;
    margin: 4em;
    grid-gap: 3em;
    grid-template-columns: repeat(auto-fit, minmax(8em, 1fr));
  }
  :global(section.grid img) {
    width: 100%;
  }
</style>
