<script>
  import Nav from './Nav.svelte'
  import ColorMode from './ColorMode.svelte'
  import Search from './Search.svelte'

  export let nav
</script>

<header>
  <Nav {nav} />
  <ColorMode />
  <Search indices={[`Pages`, `Posts`]} />
</header>

<style>
  header {
    padding: 1.5ex 1ex 1ex;
    font-size: 1.2em;
    place-content: center;
    place-items: center;
    gap: 2vw;
    white-space: nowrap;
    display: grid;
    position: sticky;
    top: 0;
    font-weight: 300;
    background: var(--headerBg);
    box-shadow: 0 -1pt 1ex 0 var(--shadowColor);
    z-index: 2;
  }
  @media (max-width: 900px) {
    header {
      gap: 5vw;
      padding: 1.5ex 2ex 1ex;
      grid-template-columns: auto 1fr auto auto;
      grid-template-areas: 'nav logo colormode search'; /* switch order of nav and logo*/
    }
  }
  @media (min-width: 901px) {
    header {
      display: flex;
    }
  }
</style>
