<script>
  import { slide, fade } from 'svelte/transition'

  import Tags from '@svg-icons/fa-solid/tags.svg'
  import ChevronExpand from '@svg-icons/bootstrap/chevron-expand.svg'
  import CircleWithCross from '@svg-icons/entypo/circle-with-cross.svg'
  import Euro from '@svg-icons/material-sharp/euro.svg'
  import SelectAll from '@svg-icons/material-sharp/select-all.svg'
  import Public from '@svg-icons/material-sharp/public.svg'
  import RateReview from '@svg-icons/material-sharp/rate-review.svg'
  import QuestionAnswer from '@svg-icons/material-sharp/question-answer.svg'
  import EventAvailable from '@svg-icons/material-sharp/event-available.svg'
  import BeachAccess from '@svg-icons/material-sharp/beach-access.svg'

  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import ChalkboardTeacher from '@svg-icons/fa-solid/chalkboard-teacher.svg'
  import HandsHelping from '@svg-icons/fa-solid/hands-helping.svg'

  import GitBranch from '@svg-icons/boxicons-regular/git-branch.svg'
  import StatsChart from '@svg-icons/ionicons-solid/stats-chart.svg'

  export let tags
  export let activeTag = `Alle`

  const icons = {
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
  }

  let open = false
  let viewWidth
  const style = `height: 18pt; vertical-align: middle; margin-right: 5pt;`
</script>

<svelte:window bind:innerWidth={viewWidth} />

<h2>
  <Tags style="height: 16pt; margin-right: 5pt;" />Tags
  {#if viewWidth < 750}
    <button on:click={() => (open = !open)} aria-label="Blog Tags öffnen">
      {#if open}
        <CircleWithCross {style} />
      {:else}
        <ChevronExpand {style} />
      {/if}
    </button>
  {/if}
</h2>
{#if viewWidth > 750 || open}
  <ul transition:slide>
    {#each Object.entries(tags) as [tag, count]}
      <li>
        <button
          transition:fade
          aria-label="Nach Tag {tag} filtern"
          class:active={activeTag === tag}
          on:click={() => (activeTag = tag)}>
          <svelte:component
            this={icons[tag]}
            style="height: 2.2ex; vertical-align: -3pt; margin-right: 6pt" />
          {tag}
          ({count})</button>
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
    max-width: 45em;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
    margin: auto;
    list-style: none;
  }
  ul > li > button {
    border: 1px dotted;
    padding: 3pt 7pt;
    transition: 0.4s;
    display: flex;
    align-items: center;
  }
  ul > li > button.active {
    box-shadow: inset 0 0 1em -5pt black;
    background: var(--green);
  }
</style>
