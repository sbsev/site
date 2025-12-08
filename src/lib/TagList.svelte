<script lang="ts">
  import { fade, slide } from 'svelte/transition'
  import type { BlogTag, Post } from './types'

  // Icon imports (bundled at build time)
  import IconSelectAll from '~icons/ic/select-all'
  import IconEuro from '~icons/ic/round-euro'
  import IconPublic from '~icons/ic/public'
  import IconGraduation from '~icons/fa-solid/graduation-cap'
  import IconRateReview from '~icons/ic/rate-review'
  import IconChalkboard from '~icons/fa-solid/chalkboard-teacher'
  import IconQuestionAnswer from '~icons/ic/question-answer'
  import IconHandshake from '~icons/fa-solid/handshake'
  import IconEvent from '~icons/ic/event-available'
  import IconBeach from '~icons/ic/beach-access'
  import IconGitBranch from '~icons/bx/git-branch'
  import IconStats from '~icons/ion/stats-chart'
  import IconDonate from '~icons/fa-solid/donate'
  import IconAward from '~icons/fa-solid/award'
  import IconEarthEurope from '~icons/fa6-solid/earth-europe'
  import IconMapLocation from '~icons/fa6-solid/map-location-dot'
  import IconWorkshop from '~icons/grommet-icons/workshop'
  import IconTags from '~icons/fa-solid/tags'
  import IconClose from '~icons/ic/round-close'
  import IconChevronExpand from '~icons/bi/chevron-expand'

  export let posts: Post[]
  export let active_tag = `Alle`

  const tagCounter: Record<string, number> = { Alle: posts.length }

  // count tag occurrences
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounter[tag] = (tagCounter[tag] ?? 0) + 1
    }
  }

  const tagOccurrences = Object.entries(tagCounter) as [BlogTag, number][]

  const icons: Record<BlogTag, typeof IconSelectAll> = {
    Alle: IconSelectAll,
    Spenden: IconEuro,
    Werbung: IconPublic,
    Standortleiter: IconGraduation,
    Erfahrungsberichte: IconRateReview,
    Nachhilfelehrer: IconChalkboard,
    Interview: IconQuestionAnswer,
    'Soziale Partner': IconHandshake,
    Events: IconEvent,
    Freizeit: IconBeach,
    IT: IconGitBranch,
    Bundesvorstand: IconStats,
    Stipendium: IconDonate,
    Mentoring: IconChalkboard,
    Auszeichnung: IconAward,
    Sonstiges: IconEarthEurope,
    Standorte: IconMapLocation,
    Workshops: IconWorkshop,
  }

  let open = false
  let viewWidth: number
  const style = `height: 18pt; margin-right: 5pt;`
</script>

<svelte:window bind:innerWidth={viewWidth} />

<h2>
  <IconTags style="height: 18pt;" />Tags
  {#if viewWidth < 750}
    <button on:click={() => (open = !open)} aria-label="Blog Tags öffnen">
      {#if open}
        <IconClose {style} />
      {:else}
        <IconChevronExpand {style} />
      {/if}
    </button>
  {/if}
</h2>
{#if viewWidth > 750 || open}
  <ul transition:slide>
    {#each tagOccurrences as [tag, count]}
      <li>
        <button
          transition:fade
          aria-label="Nach Tag {tag} filtern"
          class:active={active_tag === tag}
          on:click={() => (active_tag = tag)}
        >
          <svelte:component this={icons[tag]} style="margin-right: 6pt" />
          {tag} ({count})
        </button>
      </li>
    {/each}
  </ul>
{/if}

<style>
  h2 {
    text-align: center;
    margin-top: 2em;
  }
  ul {
    font-size: 0.9em;
    padding: 0 1em 2em;
    max-width: 50em;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
    margin: auto;
    list-style: none;
  }
  ul > li > button {
    padding: 3pt 7pt;
    transition: 0.4s;
    display: flex;
    align-items: center;
    background: var(--accent-bg);
  }
  ul > li > button.active {
    box-shadow: inset 0 0 1em -5pt black;
    background: var(--green);
  }
</style>
