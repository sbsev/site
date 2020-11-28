<script>
  import Header from 'components/Header.svelte'
  import Footer from 'components/Footer.svelte'
  import GoogleAnalytics from 'components/GoogleAnalytics.svelte'
  import { title } from './stores'
  import ApolloClient from 'apollo-boost'
  import { setClient } from 'svelte-apollo'
  import 'cross-fetch/polyfill'
  import { stores } from '@sapper/app'

  const { session } = stores()
  const { CONTENTFUL_SPACE_ID: spaceId, CONTENTFUL_ACCESS_TOKEN: accessToken } = $session

  const ctfGqlUrl = `https://graphql.contentful.com/content/v1/spaces/`
  const ctfGqlEndpoint = `${ctfGqlUrl}${spaceId}?access_token=${accessToken}`

  const client = new ApolloClient({ uri: ctfGqlEndpoint })
  setClient(client)
</script>

<svelte:head>
  <title>SbS | {$title}</title>
</svelte:head>

<GoogleAnalytics />
<Header />
<hgroup>
  <img
    src="//images.ctfassets.net/gi9muc70s4ub/357JRaqTpvKnGLYoxIplnf/f9988e7ddc838211aa5284fccc70436e/MV_Dresden_2017.JPG"
    alt="Mountains" />
  <h1>Studenten bilden Schüler</h1>
</hgroup>
<main>
  <slot />
</main>
<Footer />

<style>
  main {
    padding: 5vw;
    box-sizing: border-box;
    width: 100%;
    max-width: 70em;
    margin: 0 auto auto;
  }
  hgroup {
    position: relative;
    height: max-content;
    max-height: 700px;
    overflow: hidden;
  }
  img {
    width: 100%;
    object-position: cover;
  }
  h1 {
    color: white;
    background: rgba(0, 0, 0, 0.2);
    padding: 5pt 1ex;
    border-radius: 1ex;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: min-content;
    white-space: nowrap;
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
</style>
