<script lang="ts">
  import { BasePage, Img } from '$lib'
  import Icon from '@iconify/svelte'

  export let data

  const style = `margin: 0 5pt 0 0;`
</script>

<BasePage page={data.page}>
  <ul class="items" slot="afterArticle">
    {#each data.awards as { title, id, img, url, date, prize } (title)}
      <li>
        <a href={url}
          ><Img
            src={img}
            alt={title}
            sizes={[{ w: 175 }]}
            img_style="width: 175px; float: left; margin: 2ex 3ex 1em 0; border-radius: 2pt;"
          /></a
        >
        <h3 {id}><a href={url}>{title}</a></h3>
        <div>
          <span>
            <Icon inline icon={$microcopy?.icons?.global?.calendar} {style} />
            {date}
          </span>
          <span>
            <Icon inline icon={$microcopy?.icons?.global?.award} {style} />
            {prize}
          </span>
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
    background: var(--accent-bg);
    padding: 1ex 1em;
    border-radius: 4pt;
  }
  ul.items > li > div {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }
</style>
