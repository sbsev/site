<script>
  import Nav from './Nav.svelte'
  import ColorMode from './ColorMode.svelte'
  import Search from './Search.svelte'

  export let nav
</script>

<header>
  <a href="/"><img src="favicon.svg" alt="Favicon" /></a>
  <Nav {nav} />
  <Search
    indices={[{ name: `films`, title: `Filme` }, { name: `articles`, title: `Artikel` }, { name: `press`, title: `Pressestimmen` }]}
    highlightable={[`title`, `excerpt`, `date`, `channel`, `tag`]} />
  <ColorMode />
</header>

<style>
  header {
    padding: 1.5ex 1ex 1ex;
    font-size: 1.2em;
    place-content: center;
    place-items: center;
    gap: 2vw;
    white-space: nowrap;
    display: flex;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    font-weight: 300;
    background: var(--headerBg);
    box-shadow: 0 -1pt 1ex 0 var(--shadowColor);
    z-index: 2;
  }
  img {
    height: 1.6em;
    vertical-align: middle;
  }
</style>
