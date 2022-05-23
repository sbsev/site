<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import { fade, slide } from 'svelte/transition'
  import ChevronExpand from '~icons/bi/chevron-expand'
  import GitBranch from '~icons/bx/git-branch'
  import ChalkboardTeacher from '~icons/fa-solid/chalkboard-teacher'
  import Donate from '~icons/fa-solid/donate'
  import GraduationCap from '~icons/fa-solid/graduation-cap'
  import HandsHelping from '~icons/fa-solid/handshake'
  import Tags from '~icons/fa-solid/tags'
  import BeachAccess from '~icons/ic/beach-access'
  import EventAvailable from '~icons/ic/event-available'
  import Public from '~icons/ic/public'
  import QuestionAnswer from '~icons/ic/question-answer'
  import RateReview from '~icons/ic/rate-review'
  import CloseCross from '~icons/ic/round-close'
  import Euro from '~icons/ic/round-euro'
  import SelectAll from '~icons/ic/select-all'
  import StatsChart from '~icons/ion/stats-chart'
  import type { BlogTag } from '../types'

  export let tagOccurrences: [BlogTag, number][]
  export let activeTag = `Alle`

  const icons: Record<BlogTag, typeof SvelteComponent> = {
    Alle: SelectAll,
    Spenden: Euro,
    Werbung: Public,
    Standortleiter: GraduationCap,
    Erfahrungsberichte: RateReview,
    Nachhilfelehrer: ChalkboardTeacher,
    Interview: QuestionAnswer,
    'Soziale Partner': HandsHelping,
    Events: EventAvailable,
    Freizeit: BeachAccess,
    IT: GitBranch,
    Bundesvorstand: StatsChart,
    Stipendium: Donate,
  }

  let open = false
  let viewWidth: number
  const style = `height: 18pt; vertical-align: middle; margin-right: 5pt;`
</script>

<svelte:window bind:innerWidth={viewWidth} />

<h2>
  <Tags style="height: 16pt; margin-right: 5pt;" />Tags
  {#if viewWidth < 750}
    <button on:click={() => (open = !open)} aria-label="Blog Tags öffnen">
      {#if open}
        <CloseCross {style} />
      {:else}
        <ChevronExpand {style} />
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
          class:active={activeTag === tag}
          on:click={() => (activeTag = tag)}
        >
          <svelte:component
            this={icons[tag]}
            style="height: 2.2ex; vertical-align: -3pt; margin-right: 6pt"
          />
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
    background: var(--accentBg);
  }
  ul > li > button.active {
    box-shadow: inset 0 0 1em -5pt black;
    background: var(--green);
  }
</style>
