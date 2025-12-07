<script lang="ts">
  // import Search from 'svelte-algolia'
  import { browser } from '$app/environment'
  import { Nav, ThemeSwitcher } from '.'
  // import { SearchHit } from '.'
  import type { NavLink } from './types'

  interface Props {
    nav: NavLink[]
    breakpoint?: number
  }

  let { nav, breakpoint = 1100 }: Props = $props()

  // Only used for JavaScript behavior (mouse events in Nav), not for CSS layout
  // CSS media queries handle the visual layout, so no flash on initial load
  let viewWidth = $state(browser ? window.innerWidth : breakpoint + 1)
  const mobile = $derived(viewWidth < breakpoint)
</script>

<svelte:window bind:innerWidth={viewWidth} />

<!-- CSS classes for layout are set via media queries, not JS -->
<header>
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
    /* Default: desktop layout */
    font-size: 1.1em;
    display: flex;
  }
  /* Mobile layout via media query - no JS flash! */
  @media (max-width: 1100px) {
    header {
      font-size: 1.4em;
      gap: 5vw;
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      grid-template-areas: 'nav logo colormode search';
    }
  }
</style>
