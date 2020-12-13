<script context="module">
  import { fetchJson } from './queries'

  export async function preload(_, session) {
    const nav = await fetchJson(`Nav`, session.gqlUri)
    return { nav }
  }
</script>

<script>
  import Header from 'components/Header.svelte'
  import Footer from 'components/Footer.svelte'
  import GoogleAnalytics from 'components/GoogleAnalytics.svelte'
  import { stores } from '@sapper/app'
  import 'cross-fetch/polyfill'

  export let nav

  const { page } = stores()
</script>

<svelte:head>
  <title>SbS | {$page.path.replace(`-`, ` `)}</title>
</svelte:head>

<GoogleAnalytics />
<Header nav={nav.data.nav} />
<main>
  <slot />
</main>
<Footer />

<style>
  main {
    box-sizing: border-box;
    width: 100%;
    max-width: 70em;
    margin: 0 auto auto;
  }
  main :global(h1):first-child {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
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
    padding: 0.3em 0.6em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
  }
  main :global(img) {
    width: 100%;
  }
</style>
