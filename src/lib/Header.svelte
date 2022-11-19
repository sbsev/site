<script lang="ts">
  // import Search from 'svelte-algolia'
  import Nav from './Nav.svelte'
  import SearchHit from './SearchHit.svelte'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  import type { NavLink } from './types'

  export let nav: NavLink[]
  export let breakpoint = 1100

  let viewWidth: number
  $: mobile = viewWidth < breakpoint
  const searchProps = {
    indices: Object.fromEntries(
      [`Seiten`, `Posts`, `FAQs`, `Lernmaterial`].map((el) => [el, SearchHit])
    ),
    appId: import.meta.env.VITE_ALGOLIA_APP_ID,
    searchKey: import.meta.env.VITE_ALGOLIA_SEARCH_KEY,
    loadingMsg: `Suche läuft...`,
    noResultMsg: (query: string) => `Keine Ergebnisse für '${query}'`,
    resultCounter: (hits: unknown[]) =>
      hits.length > 0 ? `<span>Ergebnisse: ${hits.length}<span>` : ``,
    placeholder: `Suche`,
    ariaLabel: `Suche`,
  }
</script>

<svelte:window bind:innerWidth={viewWidth} />

<header class={mobile ? `mobile` : `desktop`}>
  <Nav {nav} {mobile} />

  <ThemeSwitcher />
  <!-- <Search
    {...searchProps}
    --search-hits-bg-color="var(--body-bg)"
    --search-icon-color="var(--header-color)"
    --search-input-color="white"
  /> -->
</header>

<style>
  header {
    place-content: center;
    place-items: center;
    gap: 2vw;
    white-space: nowrap;
    display: grid;
    position: sticky;
    top: 0;
    font-weight: 300;
    background: var(--header-bg);
    box-shadow: 0 0 1ex black;
    z-index: 6; /* needed to stay above multiselect and range slider on signup page */
    padding: 3pt 1ex;
  }
  header.mobile {
    font-size: 1.4em;
    gap: 5vw;
    grid-template-columns: auto 1fr auto auto;
    grid-template-areas: 'nav logo colormode search'; /* switch order of nav and logo*/
  }
  header.desktop {
    font-size: 1.1em;
    display: flex;
  }
</style>
