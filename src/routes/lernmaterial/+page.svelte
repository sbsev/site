<script lang="ts">
  import BasePage from '$lib/BasePage.svelte'
  import Img from '$lib/Img.svelte'
  import Icon from '@iconify/svelte'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  import type { PageData } from './$types'

  export let data: PageData

  const icon_map: Record<string, string> = {
    Alle: `ic:select-all`,
    Mathe: `ic:functions`,
    Wissenschaft: `ic:round-science`,
    'Lernen mit Karteikarten': `bi:card-text`,
    'Viele Fächer': `ic:group-work`,
    'Deutsche Sprache': `ic:language`,
    Englisch: `fa-brands:erlang`,
    Deutschunterricht: `simple-icons:disqus`,
    Physik: `simple-icons:atom`,
  }

  let active_tag = `Alle`
  const email = `it@studenten-bilden-schueler.de`
  let hash: string

  $: filtered = data.studyPlatforms?.filter(
    (itm) => active_tag === `Alle` || itm.tags.includes(active_tag)
  )
  // count tag occurrences
  const tags = { Alle: data.studyPlatforms?.length } as Record<string, number>
  for (const itm of data.studyPlatforms) {
    for (const tag of itm.tags) {
      tags[tag] = (tags[tag] ?? 0) + 1
    }
  }

  function setHash() {
    hash = window.location.hash.replace(`#`, ``)
  }
</script>

<!-- used to briefly flash an list item as active when it's hash is found in the URL -->
<svelte:window on:hashchange={setHash} />

<BasePage page={data.page}>
  <svelte:fragment slot="afterArticle">
    <ul class="tags">
      {#each Object.entries(tags) as [tag, count]}
        <li>
          <button class:active={active_tag === tag} on:click={() => (active_tag = tag)}>
            <Icon inline icon={icon_map[tag]} />
            {tag}
            ({count})
          </button>
        </li>
      {/each}
    </ul>
    <ul class="items">
      {#each filtered as { title, id, img, body, tags, url } (title)}
        <li animate:flip={{ duration: 200 }} transition:scale>
          <a href={url}>
            <Img
              src={img}
              alt={title}
              sizes={[{ w: 150 }]}
              img_style="width: 125px; float: right; margin: 1ex 0 1em 1em; border-radius: 2pt;"
            />
          </a>
          <h3 {id} active={id === hash}>
            <a href={url}>{title}</a>
          </h3>
          <span><Icon icon="fa-solid:tags" inline /> {tags.join(`, `)}</span>
          {@html body}
        </li>
      {/each}
    </ul>

    <div>
      <h2>Fehlt was?</h2>
      Du kennst noch weitere gute Lernmaterialien, die in unserer Liste nicht auftauchen? Schreib
      uns direkt an
      <a href="mailto:{email}">{email}</a> und wir fügen sie gerne hinzu.
    </div>
  </svelte:fragment>
</BasePage>

<!-- used to briefly flash an list item as active when it's hash is found in the URL -->
<style>
  ul,
  div {
    list-style: none;
    max-width: 50em;
    margin: auto;
    padding: 0 1em 2em;
  }
  div {
    max-width: 42em;
  }
  ul.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
    max-width: 45em;
    margin: 3em auto;
    padding: 0 1ex;
    font-size: calc(0.85em + 0.1vw);
  }
  button {
    background: var(--dark-green);
    padding: 3pt 1ex;
    border-radius: 4pt;
    transition: 0.2s;
    color: white;
  }
  button.active {
    background: var(--darker-green);
  }
  button:hover {
    background: var(--green);
    transform: scale(1.03);
  }
  ul.items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
    grid-gap: 1em;
  }
  ul.items li {
    font-size: 0.85em;
    background: var(--accent-bg);
    padding: 1ex 3ex;
    border-radius: 4pt;
  }
  ul.items li :global(ul) {
    list-style: disc;
    padding: 2ex;
    padding-bottom: 4pt;
  }
</style>
