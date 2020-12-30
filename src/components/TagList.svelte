<script>
  import { slide, fade } from 'svelte/transition'
  import Tags from '@svg-icons/fa-solid/tags.svg'
  import ChevronExpand from '@svg-icons/bootstrap/chevron-expand.svg'
  import CircleWithCross from '@svg-icons/entypo/circle-with-cross.svg'

  export let tags
  export let activeTag = `Alle`

  let open = false
  let viewWidth
</script>

<svelte:window bind:innerWidth={viewWidth} />

<h2>
  <Tags height="20" />Tags
  {#if viewWidth < 750}
    <button on:click={() => (open = !open)} aria-label="Blog Tags öffnen">
      {#if open}
        <CircleWithCross height="20" />
      {:else}
        <ChevronExpand height="20" />
      {/if}
    </button>
  {/if}
</h2>
{#if viewWidth > 750 || open}
  <ul transition:slide>
    {#each tags as { title, total, icon }}
      <li>
        <button
          transition:fade
          aria-label="Nach Tag {title} filtern"
          class:active={activeTag === title}
          on:click={() => (activeTag = title)}>
          <img src={icon.url} alt={title} />
          {title}
          ({total})</button>
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
    background: var(--buttonBg);
  }
  ul > li > button > img {
    height: 1em;
    background: var(--buttonBg);
    padding: 3pt;
    border-radius: 1ex;
    vertical-align: bottom;
    margin-right: 4pt;
  }
</style>
