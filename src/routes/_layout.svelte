<!-- eslint-disable no-console -->
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

  const client = new ApolloClient({
    uri: ctfGqlEndpoint,
    onError: ({ graphQLErrors }) => {
      // eslint-disable-next-line no-console
      console.log(`graphQLErrors`, graphQLErrors)
    },
  })
  setClient(client)
</script>

<svelte:head>
  <title>SbS | {$title}</title>
</svelte:head>

<GoogleAnalytics />
<Header />
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
</style>
