<script context="module">
  import { fetchYamlList, fetchPage } from '../utils/queries'

  export async function load() {
    const page = await fetchPage(`auszeichnungen`)
    const items = await fetchYamlList(`Auszeichnungen`, `auszeichnungen#`)
    return { props: { page, items } }
  }
</script>

<script>
  import Calendar from '@svicons/octicons/calendar.svelte'
  import PriceRibbon from '@svicons/fa-solid/award.svelte'

  import Img from '../components/Img.svelte'
  import BasePage from '../components/BasePage.svelte'

  export let items, page

  let hash

  const imgStyle = `width: 175px; float: left; margin: 2ex 3ex 1em 0; border-radius: 2pt;`
  const style = `height: 2.2ex; vertical-align: text-top; margin: 0 5pt 0 0;`
</script>

<!-- used to briefly flash an list item as active when it's hash is found in the URL -->
<svelte:window on:hashchange={() => (hash = window.location.hash.replace(`#`, ``))} />

<BasePage {page}>
  <ul class="items" slot="afterArticle">
    {#each items as { title, id, img, url, date, prize } (title)}
      <li>
        <a href={url}><Img src={img} alt={title} sizes={[{ w: 175 }]} {imgStyle} /></a>
        <h3 {id} active={id === hash}><a href={url}>{title}</a></h3>
        <div>
          <span><Calendar {style} />{date}</span>
          <span><PriceRibbon {style} />{prize}</span>
        </div>
      </li>
    {/each}
  </ul>
</BasePage>

<style>
  ul.items {
    list-style: none;
    max-width: 50em;
    margin: auto;
    padding: 0 1em 2em;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
    grid-gap: 1em;
  }
  ul.items > li {
    font-size: 0.85em;
    background: var(--accentBg);
    padding: 1ex 1em;
    border-radius: 4pt;
  }
  ul.items > li > div {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }
</style>
