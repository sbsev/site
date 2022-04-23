<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import Calendar from '@svicons/octicons/calendar.svelte'
  import PriceRibbon from '~icons/fa-solid/award'
  import BasePage from '../components/BasePage.svelte'
  import Img from '../components/Img.svelte'
  import { fetchPage, fetchYamlList } from '../fetch'
  import type { Award, Page } from '../types'

  export const load: Load = async () => {
    const page = await fetchPage(`auszeichnungen`)
    const awards = await fetchYamlList(`Auszeichnungen`, `auszeichnungen#`)

    return { props: { page, awards } }
  }
</script>

<script lang="ts">
  export let awards: Award[]
  export let page: Page

  const imgStyle = `width: 175px; float: left; margin: 2ex 3ex 1em 0; border-radius: 2pt;`
  const style = `height: 2.2ex; vertical-align: text-top; margin: 0 5pt 0 0;`
</script>

<BasePage {page}>
  <ul class="items" slot="afterArticle">
    {#each awards as { title, id, img, url, date, prize } (title)}
      <li>
        <a href={url}><Img src={img} alt={title} sizes={[{ w: 175 }]} {imgStyle} /></a>
        <h3 {id}><a href={url}>{title}</a></h3>
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
