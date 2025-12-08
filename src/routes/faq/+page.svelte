<script lang="ts">
  import { Collapsible } from '$lib'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  // Icon imports (bundled at build time)
  import IconHandsHelping from '~icons/fa-solid/hands-helping'
  import IconChalkboard from '~icons/fa-solid/chalkboard-teacher'
  import IconSupportAgent from '~icons/ic/round-support-agent'
  import IconSelectAll from '~icons/ic/select-all'
  import IconFilterFrames from '~icons/ic/filter-frames'
  import IconExit from '~icons/ic/exit-to-app'
  import IconMisc from '~icons/ic/round-miscellaneous-services'
  import IconPrivacy from '~icons/ic/round-privacy-tip'
  import IconStorefront from '~icons/ic/round-storefront'
  import IconInsurance from '~icons/map/insurance-agency'
  import IconGroup from '~icons/ic/round-group'
  import IconAssignment from '~icons/ic/round-assignment-ind'
  import IconTags from '~icons/fa-solid/tags'

  const { data } = $props()

  const icons: Record<string, typeof IconSelectAll> = {
    'Rund ums Engagement': IconHandsHelping,
    Nachhilfe: IconChalkboard,
    Vermittlung: IconSupportAgent,
    Alle: IconSelectAll,
    Rahmenbedingungen: IconFilterFrames,
    Vereinsaustritt: IconExit,
    Sonstiges: IconMisc,
    Datenschutz: IconPrivacy,
    'Tipps für Standorte': IconStorefront,
    Versicherung: IconInsurance,
    Mitgliederversammlung: IconGroup,
    Führungszeugnis: IconAssignment,
  }

  let active_tag = $state(`Alle`)
  const email = `info@studytutors.de`
  let hash = $state(typeof window !== `undefined` ? window.location.hash.slice(1) : ``)

  const filteredFaqs = $derived(
    Array.isArray(data.faqs)
      ? data.faqs.filter((faq) => active_tag === `Alle` || faq.tags.includes(active_tag))
      : []
  )

  // count tag occurrences
  const tags = $derived(
    Array.isArray(data.faqs)
      ? data.faqs.reduce(
        (obj, faq) => {
          faq.tags.forEach((tag) => (obj[tag] = obj[tag] ? obj[tag] + 1 : 1))
          return obj
        },
        { Alle: data.faqs.length }
      )
      : { Alle: 0 }
  )
</script>

<!-- used to briefly flash an FAQ as active when it's hash is found in the URL -->
<svelte:window onhashchange={() => (hash = window.location.hash.replace(`#`, ``))} />

<h1>FAQs</h1>
<ul class="tags">
  {#each Object.entries(tags).sort() as [tag, count] (tag)}
    <li>
      <button class:active={active_tag === tag} onclick={() => (active_tag = tag)}>
        <svelte:component this={icons[tag]} style="display: inline; vertical-align: -0.125em;" />
        {tag}
        ({count})</button
      >
    </li>
  {/each}
</ul>
<ul class="faqs">
  {#each filteredFaqs as { title: faqTitle, id, body, tags: itemTags } (faqTitle)}
    <li animate:flip={{ duration: 200 }} transition:scale>
      <Collapsible {id} active={id === hash}>
        {#snippet title()}
          <span>
            {faqTitle}
            <IconTags width="16pt" style="margin: 0 3pt 0 10pt;" />
            <small>{itemTags.join(`, `)}</small>
          </span>
        {/snippet}
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
