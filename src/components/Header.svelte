<script lang="ts">
  import { session } from '$app/stores'
  import Search from 'svelte-algolia/Search.svelte'
  import ColorMode from 'svelte-color-mode/ColorMode.svelte'
  import ModalColorPicker from 'svelte-color-mode/ModalColorPicker.svelte'
  import type { NavLink } from '../types'
  import { colors, colorsByMode } from '../utils/colors'
  import Nav from './Nav.svelte'
  export let nav: NavLink[]
</script>

<header>
  <Nav {nav} />

  <ColorMode {colorsByMode} otherColors={colors} />
  <ModalColorPicker
    ariaLabelBtnOpener="Farbmodus öffnen"
    darkName="Dunkel"
    lightName="Hell"
  />

  <Search
    indices={[`Seiten`, `Posts`, `FAQs`, `Lernmaterial`]}
    appId={$session.ALGOLIA_APP_ID}
    searchKey={$session.ALGOLIA_SEARCH_KEY}
  />
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
    z-index: 4; /* needed to display above range slider pips on signup page */
    padding: 3pt 1ex;
  }
  @media (max-width: 1000px) {
    header {
      font-size: 1.4em;
      gap: 5vw;
      grid-template-columns: auto 1fr auto auto;
      grid-template-areas: 'nav logo colormode search'; /* switch order of nav and logo*/
    }
  }
  @media (min-width: 1001px) {
    header {
      font-size: 1.2em;
      display: flex;
    }
  }
</style>
