<script lang="ts">
  // import Search from 'svelte-algolia'
  import BrightnessAuto from '~icons/bi/laptop'
  import Sun from '~icons/ic/round-wb-sunny'
  import type { NavLink } from '../types'
  import Moon from './icons/Moon.svelte'

  import Nav from './Nav.svelte'
  import { colorMode } from './stores'

  export let nav: NavLink[]
  export let breakpoint = 1100

  let viewWidth: number
  $: mobile = viewWidth < breakpoint
  // const searchProps = {
  //   indices: Object.fromEntries(
  //     [`Seiten`, `Posts`, `FAQs`, `Lernmaterial`].map((el) => [el, SearchHit])
  //   ),
  //   appId: import.meta.env.VITE_ALGOLIA_APP_ID,
  //   searchKey: import.meta.env.VITE_ALGOLIA_SEARCH_KEY,
  //   loadingStr: `Suche läuft...`,
  //   noResultMsg: (query: string) => `Keine Ergebnisse für '${query}'`,
  //   resultReporter: (hits: unknown[]) =>
  //     hits.length > 0 ? `<span>Ergebnisse: ${hits.length}<span>` : ``,
  //   placeholder: `Suche`,
  //   ariaLabel: `Suche`,
  // }
  const color_mode_icons = [
    [`light`, BrightnessAuto],
    [`dark`, Moon],
    [`system`, Sun],
  ] as const
  let mode_idx = 0

  function set_color_mode() {
    mode_idx = (mode_idx + 1) % color_mode_icons.length
    $colorMode = color_mode_icons[mode_idx][0]
  }
</script>

<svelte:window bind:innerWidth={viewWidth} />

<header class={mobile ? `mobile` : `desktop`}>
  <Nav {nav} {mobile} />

  <!-- TODO: i18n the color mode titles -->
  <button
    title="Set color mode"
    on:click={set_color_mode}
    style="display: flex; color: white;"
  >
    <svelte:component
      this={color_mode_icons[mode_idx][1]}
      width="1em"
      title="Color mode {$colorMode}"
    />
  </button>

  <!-- <Search
    {...searchProps}
    --hitsBgColor="var(--bodyBg)"
    --iconColor="var(--headerColor)"
    --inputColor="white"
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
    background: var(--headerBg);
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
