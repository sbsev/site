<script context="module">
  import { fetchYamlList, fetchPage } from '../utils/queries'

  export async function preload() {
    const page = await fetchPage(`lernmaterial`)
    const studyPlatforms = await fetchYamlList(`Lernmaterial`, `lernmaterial#`)
    return { page, studyPlatforms }
  }
</script>

<script>
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  import SelectAll from '@svg-icons/material-sharp/select-all.svg'
  import Tags from '@svg-icons/fa-solid/tags.svg'
  import Functions from '@svg-icons/material-sharp/functions.svg'
  import Science from '@svg-icons/material-sharp/science.svg'
  import CardText from '@svg-icons/bootstrap/card-text.svg'
  import GroupWork from '@svg-icons/material-sharp/group-work.svg'
  import Language from '@svg-icons/material-sharp/language.svg'
  import Erlang from '@svg-icons/fa-brands/erlang.svg'
  import Disqus from '@svg-icons/simple-icons/disqus.svg'
  import Atom from '@svg-icons/simple-icons/atom.svg'

  import Img from '../components/Img.svelte'
  import BasePage from '../components/BasePage.svelte'

  export let studyPlatforms, page

  const icons = {
    Alle: SelectAll,
    Mathe: Functions,
    Wissenschaft: Science,
    'Lernen mit Karteikarten': CardText,
    'Viele Fächer': GroupWork,
    'Deutsche Sprache': Language,
    Englisch: Erlang,
    Deutschunterricht: Disqus,
    Physik: Atom,
  }

  let activeTag = `Alle`
  const email = `it@studenten-bilden-schueler.de`
  let hash

  $: filtered = studyPlatforms.filter(
    (itm) => activeTag === `Alle` || itm.tags.includes(activeTag)
  )
  // count tag occurences
  const tags = studyPlatforms.reduce(
    (acc, itm) => {
      itm.tags.forEach((tag) => (acc[tag] = acc[tag] ? acc[tag] + 1 : 1))
      return acc
    },
    { Alle: studyPlatforms.length }
  )
  const imgStyle = `width: 125px; float: right; margin: 1ex 0 1em 1em; border-radius: 2pt;`
  const style = `height: 2.2ex; vertical-align: -3pt;`

  function setHash() {
    hash = window.location.hash.replace(`#`, ``)
  }
</script>

<!-- used to briefly flash an list item as active when it's hash is found in the URL -->
<svelte:window on:hashchange={setHash} />

<BasePage {page}>
  <svelte:fragment slot="afterArticle">
    <ul class="tags">
      {#each Object.entries(tags) as [tag, count]}
        <li>
          <button class:active={activeTag === tag} on:click={() => (activeTag = tag)}>
            <svelte:component this={icons[tag]} {style} />
            {tag}
            ({count})</button>
        </li>
      {/each}
    </ul>
    <ul class="items">
      {#each filtered as { title, id, img, body, tags, url } (title)}
        <li animate:flip={{ duration: 200 }} transition:scale>
          <a href={url}><Img src={img} alt={title} sizes={[{ w: 150 }]} {imgStyle} /></a>
          <h3 {id} active={id === hash}><a href={url}>{title}</a></h3>
          <span><Tags {style} /> {tags.join(`, `)}</span>
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
    background: var(--darkGreen);
    padding: 3pt 1ex;
    border-radius: 4pt;
    transition: 0.2s;
    color: white;
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
    background: var(--accentBg);
    padding: 1ex 3ex;
    border-radius: 4pt;
  }
  ul.items li :global(ul) {
    list-style: disc;
    padding: 2ex;
    padding-bottom: 4pt;
  }
</style>
