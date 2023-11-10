<script lang="ts">
  import { BasePage, Img } from '$lib'
  import Icon from '@iconify/svelte'

  export let data

  const style = `margin: 0 5pt 0 0;`
</script>

<BasePage page={data.page}>
  <svelte:fragment slot="afterArticle">
    {#each Object.entries(data.pressItems).reverse() as [year, pressArr] (year)}
      <h2>{year}</h2>
      <ul class="items">
        {#each pressArr as { title, id, img, url, date, chapter, source } (id)}
          <li>
            <a href={url}>
              <Img
                src={img}
                alt={title}
                sizes={[{ w: 175 }]}
                img_style="width: 125px; float: left; margin: 2ex 3ex 1em 0; border-radius: 2pt;"
              />
            </a>
            <h3 {id}>
              <a href={url}>{title}</a>
            </h3>
            <div>
              <span>
                <Icon inline icon={$microcopy?.icons?.global?.newspaper} {style} />
                {source}
              </span>
              <span>
                <Icon inline icon={$microcopy?.icons?.global?.calendar} {style} />
                {new Date(date).toLocaleDateString(`de`)}
              </span>
              <span>
                <Icon inline icon={$microcopy?.icons?.global?.place} {style} />
                Standort {chapter}
              </span>
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
    background: var(--accent-bg);
    padding: 1ex 1em;
    border-radius: 4pt;
  }
  ul.items li div {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }
</style>
