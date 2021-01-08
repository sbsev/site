<script context="module">
  import { fetchFaqs } from '../utils/queries'

  export async function preload() {
    const faqs = await fetchFaqs()
    return { faqs }
  }
</script>

<script>
  import ChalkboardTeacher from '@svg-icons/fa-solid/chalkboard-teacher.svg'
  import HandsHelping from '@svg-icons/fa-solid/hands-helping.svg'
  import SupportAgent from '@svg-icons/material-sharp/support-agent.svg'
  import SelectAll from '@svg-icons/material-sharp/select-all.svg'
  import FilterFrames from '@svg-icons/material-sharp/filter-frames.svg'
  import ExitToApp from '@svg-icons/material-sharp/exit-to-app.svg'
  import MiscellaneousServices from '@svg-icons/material-sharp/miscellaneous-services.svg'

  const iconMap = {
    'Rund ums Engagement': HandsHelping,
    Nachhilfe: ChalkboardTeacher,
    Vermittlung: SupportAgent,
    Alle: SelectAll,
    Rahmenbedingungen: FilterFrames,
    Vereinsaustritt: ExitToApp,
    Sonstiges: MiscellaneousServices,
  }

  import Collapsible from '../components/Collapsible.svelte'

  export let faqs

  let activeTag = `Alle`
  const email = `info@studenten-bilden-schueler.de`
  let hash

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
  {#each Object.entries(tags) as [tag, count]}
    <button class:active={activeTag === tag} on:click={() => (activeTag = tag)}>
      <svelte:component this={iconMap[tag]} style="height: 2ex; vertical-align: -3pt;" />
      {tag}
      ({count})</button>
  {/each}
</ul>
<ul class="faqs">
  {#each filteredFaqs as { title, id, body } (title)}
    <Collapsible {title} {id} active={id === hash}>
      {@html body}
    </Collapsible>
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
  ul.faqs,
  div {
    list-style: none;
    max-width: 50em;
    margin: auto;
    padding: 0 1em 2em;
  }
  ul.faqs :global(p) {
    margin: 0;
  }
</style>
