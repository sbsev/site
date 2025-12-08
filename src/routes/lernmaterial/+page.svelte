<script lang="ts">
  import { BasePage, Img } from '$lib'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  // Icon imports (bundled at build time)
  import IconSelectAll from '~icons/ic/select-all'
  import IconFunctions from '~icons/ic/functions'
  import IconScience from '~icons/ic/round-science'
  import IconCardText from '~icons/bi/card-text'
  import IconGroupWork from '~icons/ic/group-work'
  import IconLanguage from '~icons/ic/language'
  import IconErlang from '~icons/fa-brands/erlang'
  import IconDisqus from '~icons/simple-icons/disqus'
  import IconAtom from '~icons/simple-icons/atom'
  import IconTags from '~icons/fa-solid/tags'

  const { data } = $props()

  const icon_map: Record<string, typeof IconSelectAll> = {
    Alle: IconSelectAll,
    Mathe: IconFunctions,
    Wissenschaft: IconScience,
    'Lernen mit Karteikarten': IconCardText,
    'Viele Fächer': IconGroupWork,
    'Deutsche Sprache': IconLanguage,
    Englisch: IconErlang,
    Deutschunterricht: IconDisqus,
    Physik: IconAtom,
  }

  let active_tag = $state(`Alle`)
  const email = `it@studytutors.de`
  let hash = $state(``)

  const filtered = $derived(
    Array.isArray(data.studyPlatforms)
      ? data.studyPlatforms.filter((itm) => active_tag === `Alle` || itm.tags.includes(active_tag))
      : []
  )

  // count tag occurrences
  const tags = $derived((() => {
    if (!Array.isArray(data.studyPlatforms)) return { Alle: 0 }

    const tagCounts = { Alle: data.studyPlatforms.length } as Record<string, number>
    for (const itm of data.studyPlatforms) {
      for (const tag of itm.tags) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
      }
    }
    return tagCounts
  })())

  function setHash() {
    hash = window.location.hash.replace(`#`, ``)
  }
</script>

<!-- used to briefly flash an list item as active when it's hash is found in the URL -->
<svelte:window onhashchange={setHash} />

<BasePage page={data.page}>
  {#snippet afterArticle()}
    <ul class="tags">
      {#each Object.entries(tags) as [tag, count]}
        <li>
          <button class:active={active_tag === tag} onclick={() => (active_tag = tag)}>
            <svelte:component this={icon_map[tag]} style="display: inline; vertical-align: -0.125em;" />
            {tag}
            ({count})
          </button>
        </li>
      {/each}
    </ul>
    <ul class="items">
      {#each filtered as { title, id, img, body, tags: itemTags, url } (title)}
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
          <span><IconTags style="display: inline; vertical-align: -0.125em;" /> {itemTags.join(`, `)}</span>
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
  {/snippet}
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
