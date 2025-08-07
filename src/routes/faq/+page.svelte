<script lang="ts">
  import { Collapsible } from '$lib'
  import Icon from '@iconify/svelte'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  export let data

  const icons: Record<string, string> = {
    'Rund ums Engagement': `fa-solid:hands-helping`,
    Nachhilfe: `fa-solid:chalkboard-teacher`,
    Vermittlung: `ic:round-support-agent`,
    Alle: `ic:select-all`,
    Rahmenbedingungen: `ic:filter-frames`,
    Vereinsaustritt: `ic:exit-to-app`,
    Sonstiges: `ic:round-miscellaneous-services`,
    Datenschutz: `ic:round-privacy-tip`,
    'Tipps für Standorte': `ic:round-storefront`,
    Versicherung: `map:insurance-agency`,
    Mitgliederversammlung: `ic:round-group`,
    Führungszeugnis: `ic:round-assignment-ind`,
  }

  let active_tag = `Alle`
  const email = `info@studytutors.de`
  let hash = typeof window !== `undefined` ? window.location.hash.slice(1) : ``

  $: filteredFaqs = Array.isArray(data.faqs)
    ? data.faqs.filter((faq) => active_tag === `Alle` || faq.tags.includes(active_tag))
    : []

  // count tag occurrences
  $: tags = Array.isArray(data.faqs)
    ? data.faqs.reduce(
      (obj, faq) => {
        faq.tags.forEach((tag) => (obj[tag] = obj[tag] ? obj[tag] + 1 : 1))
        return obj
      },
      { Alle: data.faqs.length }
    )
    : { Alle: 0 }
</script>

<!-- used to briefly flash an FAQ as active when it's hash is found in the URL -->
<svelte:window on:hashchange={() => (hash = window.location.hash.replace(`#`, ``))} />

<h1>FAQs</h1>
<ul class="tags">
  {#each Object.entries(tags).sort() as [tag, count] (tag)}
    <li>
      <button class:active={active_tag === tag} on:click={() => (active_tag = tag)}>
        <Icon inline icon={icons[tag]} />
        {tag}
        ({count})</button
      >
    </li>
  {/each}
</ul>
<ul class="faqs">
  {#each filteredFaqs as { title, id, body, tags } (title)}
    <li animate:flip={{ duration: 200 }} transition:scale>
      <Collapsible {id} active={id === hash}>
        <span slot="title">
          {title}
          <Icon icon="fa-solid:tags" width="16pt" style="margin: 0 3pt 0 10pt;" />
          <small>{tags.join(`, `)}</small>
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
  }
  button {
    background: var(--dark-green);
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
