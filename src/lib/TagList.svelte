<script lang="ts">
  import Icon from '@iconify/svelte'
  import { fade, slide } from 'svelte/transition'
  import { microcopy } from './stores'

  export let posts: Post[]
  export let active_tag = `Alle`

  const tagCounter: Record<string, number> = { Alle: posts.length }

  // count tag occurrences
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounter[tag] = (tagCounter[tag] ?? 0) + 1
    }
  }

  const tagOccurrences = Object.entries(tagCounter) as [string, number][]

  const icons: Record<string, string> = $microcopy?.icons?.tags?.blog ?? {}
  let open = false
  let viewWidth: number
  const style = `height: 18pt; margin-right: 5pt;`
</script>

<svelte:window bind:innerWidth={viewWidth} />

<h2>
  <Icon icon={$microcopy?.icons?.global?.tags} style="height: 18pt;" />Tags
  {#if viewWidth < 750}
    <button on:click={() => (open = !open)} aria-label="Blog Tags öffnen">
      {#if open}
        <Icon inline icon={$microcopy?.icons?.global?.close} {style} />
      {:else}
        <Icon inline icon={$microcopy?.icons?.global?.expand} {style} />
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
    background: var(--accent-bg);
  }
  ul > li > button.active {
    box-shadow: inset 0 0 1em -5pt black;
    background: var(--green);
  }
</style>
