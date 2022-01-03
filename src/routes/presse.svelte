<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import Newspaper from '@svicons/ionicons-solid/newspaper.svelte'
  import Place from '@svicons/material-sharp/place.svelte'
  import Calendar from '@svicons/octicons/calendar.svelte'
  import BasePage from '../components/BasePage.svelte'
  import Img from '../components/Img.svelte'
  import type { Page, PressItem } from '../types'
  import { fetchPage, fetchYamlList } from '../utils/queries'

  export const load: Load = async () => {
    const page = await fetchPage(`presse`)

    const pressItems = await fetchYamlList(`Presse`, `presse#`)

    return { props: { page, pressItems } }
  }
</script>

<script lang="ts">
  export let pressItems: PressItem[]
  export let page: Page

  const itemsByYear = pressItems.reduce((acc, itm) => {
    const year = itm.date.getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(itm)
    return acc
  }, {}) as Record<number, PressItem[]>

  const imgStyle = `width: 125px; float: left; margin: 2ex 3ex 1em 0; border-radius: 2pt;`
  const style = `height: 2.2ex; vertical-align: text-bottom; margin: 0 5pt 0 0;`
</script>

<BasePage {page}>
  <svelte:fragment slot="afterArticle">
    {#each Object.entries(itemsByYear).reverse() as [year, pressArr] (year)}
      <h2>{year}</h2>
      <ul class="items">
        {#each pressArr as { title, id, img, url, date, chapter, source } (id)}
          <li>
            <a href={url}>
              <Img src={img} alt={title} sizes={[{ w: 175 }]} {imgStyle} />
            </a>
            <h3 {id}>
              <a href={url}>{title}</a>
            </h3>
            <div>
              <span><Newspaper {style} />{source}</span>
              <span><Calendar {style} />{new Date(date).toLocaleDateString(`de`)}</span>
              <span><Place {style} />Standort {chapter}</span>
            </div>
          </li>
        {/each}
      </ul>
    {/each}
  </svelte:fragment>
</BasePage>

<style>
  h2 {
    text-align: center;
  }
  ul.items {
    list-style: none;
    max-width: 50em;
    margin: auto;
    padding: 0 1em 2em;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
    grid-gap: 1em;
  }
  ul.items li {
    font-size: 0.85em;
    background: var(--accentBg);
    padding: 1ex 1em;
    border-radius: 4pt;
  }
  ul.items li div {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }
</style>
