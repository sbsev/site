<script lang="ts">
  import Icon from '@iconify/svelte'
  import { fade, slide } from 'svelte/transition'
  import type { BlogTag, Post } from './types'

  export let posts: Post[]
  export let activeTag = `Alle`

  const tagCounter: Record<string, number> = { Alle: posts.length }

  // count tag occurrences
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounter[tag] = (tagCounter[tag] ?? 0) + 1
    }
  }

  const tagOccurrences = Object.entries(tagCounter) as [BlogTag, number][]

  const icons: Record<BlogTag, string> = {
    Alle: `ic:select-all`,
    Spenden: `ic:round-euro`,
    Werbung: `ic:public`,
    Standortleiter: `fa-solid:graduation-cap`,
    Erfahrungsberichte: `ic:rate-review`,
    Nachhilfelehrer: `fa-solid:chalkboard-teacher`,
    Interview: `ic:question-answer`,
    'Soziale Partner': `fa-solid:handshake`,
    Events: `ic:event-available`,
    Freizeit: `ic:beach-access`,
    IT: `bx:git-branch`,
    Bundesvorstand: `ion:stats-chart`,
    Stipendium: `fa-solid:donate`,
    Mentoring: `fa-solid:chalkboard-teacher`,
    Auszeichnung: `fa-solid:award`,
  }

  let open = false
  let viewWidth: number
  const style = `height: 18pt; margin-right: 5pt;`
</script>

<svelte:window bind:innerWidth={viewWidth} />

<h2>
  <Icon icon="fa-solid:tags" style="height: 18pt;" />Tags
  {#if viewWidth < 750}
    <button on:click={() => (open = !open)} aria-label="Blog Tags öffnen">
      {#if open}
        <Icon inline icon="ic:round-close" {style} />
      {:else}
        <Icon inline icon="bi:chevron-expand" {style} />
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
          <Icon inline icon={icons[tag]} style="margin-right: 6pt" />
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
