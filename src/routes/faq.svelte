<script context="module">
  import { fetchYamlList } from '../utils/queries'

  export async function preload() {
    const faqs = await fetchYamlList(`FAQ`, `faq#`)
    return { faqs }
  }
</script>

<script>
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  import ChalkboardTeacher from '@svg-icons/fa-solid/chalkboard-teacher.svg'
  import HandsHelping from '@svg-icons/fa-solid/hands-helping.svg'
  import SupportAgent from '@svg-icons/material-sharp/support-agent.svg'
  import SelectAll from '@svg-icons/material-sharp/select-all.svg'
  import FilterFrames from '@svg-icons/material-sharp/filter-frames.svg'
  import ExitToApp from '@svg-icons/material-sharp/exit-to-app.svg'
  import MiscellaneousServices from '@svg-icons/material-sharp/miscellaneous-services.svg'
  import Tags from '@svg-icons/fa-solid/tags.svg'

  import Collapsible from '../components/Collapsible.svelte'

  export let faqs

  const icons = {
    'Rund ums Engagement': HandsHelping,
    Nachhilfe: ChalkboardTeacher,
    Vermittlung: SupportAgent,
    Alle: SelectAll,
    Rahmenbedingungen: FilterFrames,
    Vereinsaustritt: ExitToApp,
    Sonstiges: MiscellaneousServices,
  }

  let activeTag = `Alle`
  const email = `info@studenten-bilden-schueler.de`
  let hash = typeof window !== `undefined` ? window.location.hash.slice(1) : ``

  $: filteredFaqs = faqs.filter(
    (faq) => activeTag === `Alle` || faq.tags.includes(activeTag)
  )
  // count tag occurences
  const tags = faqs.reduce(
    (obj, faq) => {
      faq.tags.forEach((tag) => (obj[tag] = obj[tag] ? obj[tag] + 1 : 1))
      return obj
    },
    { Alle: faqs.length }
  )
</script>

<!-- used to briefly flash an FAQ as active when it's hash is found in the URL -->
<svelte:window on:hashchange={() => (hash = window.location.hash.replace(`#`, ``))} />

<h1>FAQs</h1>
<ul class="tags">
  {#each Object.entries(tags) as [tag, count] (tag)}
    <li>
      <button class:active={activeTag === tag} on:click={() => (activeTag = tag)}>
        <svelte:component this={icons[tag]} style="height: 2ex; vertical-align: -3pt;" />
        {tag}
        ({count})</button>
    </li>
  {/each}
</ul>
<ul class="faqs">
  {#each filteredFaqs as { title, id, body, tags } (title)}
    <li animate:flip={{ duration: 200 }} transition:scale>
      <Collapsible {id} active={id === hash}>
        <span slot="title">
          {title}
          <Tags width="1.4ex" style="margin: 0 3pt 0 1ex" /><small
            >{tags.join(`, `)}</small>
        </span>
        {@html body}
      </Collapsible>
    </li>
  {/each}
</ul>

<div>
  <h2>Deine Frage war nicht dabei?</h2>
  Schreib uns direkt an
  <a href="mailto:{email}">{email}</a>.
</div>

<style>
  h1 {
    margin-top: 2em;
  }
  ul,
  div {
    list-style: none;
    max-width: 50em;
    margin: auto;
    padding: 0 1em 2em;
  }
  ul.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
    max-width: 45em;
    margin: 1em auto 2em;
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
  button.active {
    background: var(--blue);
  }
  ul.faqs :global(p) {
    margin: 0;
  }
  small {
    font-weight: 200;
  }
</style>
