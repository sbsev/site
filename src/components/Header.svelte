<script>
  import Nav from './Nav.svelte'
  import ColorMode from './ColorMode.svelte'
  import Search from './Search.svelte'

  export let nav
</script>

<header>
  <Nav {nav} />
  <ColorMode />
  <Search indices={[`Seiten`, `Posts`, `FAQs`]} />
</header>

<style>
  header {
    font-size: 1.1em;
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
    z-index: 2;
    padding: 3pt 1ex;
  }
  @media (max-width: 1000px) {
    header {
      gap: 5vw;
      grid-template-columns: auto 1fr auto auto;
      grid-template-areas: 'nav logo colormode search'; /* switch order of nav and logo*/
    }
  }
  @media (min-width: 1001px) {
    header {
      display: flex;
    }
  }
</style>
