<script lang="ts">
  import { tweened } from 'svelte/motion'
  import { slide } from 'svelte/transition'
  import type { Snippet } from 'svelte'

  interface Props {
    id: string
    active: boolean
    title?: Snippet
    children?: Snippet
  }

  let { id, active = $bindable(), title: titleSnippet, children }: Props = $props()

  const duration = 200
  const angle = tweened(180, { duration })

  let isOpen = $state(false)

  $effect(() => {
    if (active) {
      toggle()
      setTimeout(() => (active = false), 2000)
    }
  })

  function toggle() {
    isOpen = !isOpen
    angle.set(isOpen ? 0 : 180)
  }
</script>

<h3 style="--angle: {$angle}" class:active>
  <span class="anchor" {id}></span>
  <button onclick={toggle}>
    <span style="display: inline-block; transform: rotate({$angle}deg);">👆</span>
    {#if titleSnippet}
      {@render titleSnippet()}
    {/if}
  </button>
</h3>
{#if isOpen}
  <div transition:slide={{ duration }}>
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  h3 {
    cursor: pointer;
    background: var(--light-bg);
    border-radius: 4pt;
    padding: 4pt 1ex;
    margin: 1em auto;
    max-width: 100%;
    transition: 0.6s;
  }
  h3:hover {
    transform: scale(1.01);
  }
  h3.active {
    background: rgba(255, 255, 255, 0.4);
  }
  /* used to scroll a heading into the page center (rather than the top
  where its hidden by the header) when linking to its hash */
  .anchor {
    position: absolute;
    transform: translateY(-50vh);
  }
  div {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4pt;
    overflow: auto;
    padding: 4pt 1ex;
    text-align: left;
  }
</style>
