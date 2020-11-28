<script>
  import Nav from 'components/Nav.svelte'
  import ColorMode from 'components/ColorMode.svelte'
  import Search from 'components/Search.svelte'
</script>

<header>
  <Nav />
  <Search
    indices={[{ name: `films`, title: `Filme` }, { name: `articles`, title: `Artikel` }, { name: `press`, title: `Pressestimmen` }]}
    highlightable={[`title`, `excerpt`, `date`, `channel`, `tag`]} />
  <ColorMode />
</header>

<style>
  header {
    padding: 4pt 1ex 0;
    border-bottom: 1px solid var(--borderColor);
    font-size: 1.2em;
    place-content: center;
    place-items: center;
    gap: 2vw;
    white-space: nowrap;
    display: flex;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    background: var(--bodyBg);
    box-shadow: 0 -1pt 1ex 0 var(--shadowColor);
    z-index: 2;
  }
</style>
