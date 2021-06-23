<script context="module">
  import { fetchChapters } from '../utils/queries'

  export async function load() {
    const chapters = await fetchChapters()

    return { props: { chapters } }
  }
</script>

<script>
  import Map from '../components/Map.svelte'

  export let chapters
</script>

<div>
  <Map
    markers={chapters.map((chap) => ({
      ...chap.coords,
      color: chap.acceptsSignups ? `var(--lightBlue)` : `var(--darkGreen)`,
      title: chap.title,
      url: chap.slug,
    }))} />

  <legend>
    <span style="background: var(--lightBlue)" /> aktiver Standort&ensp;
    <span style="background: var(--darkGreen)" /> in Gründung
  </legend>
</div>

<style>
  div {
    position: relative;
  }
  legend {
    position: absolute;
    right: 1ex;
    bottom: 1ex;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 2pt 4pt;
    border-radius: 3pt;
  }
  span {
    width: 2ex;
    height: 2ex;
    display: inline-block;
    border-radius: 50%;
    border: 1px dashed white;
    vertical-align: text-bottom;
  }
</style>
