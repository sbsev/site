<script>
  import { slide } from 'svelte/transition'
  import { tweened } from 'svelte/motion'

  export let title, id, active

  const duration = 200
  const angle = tweened(180, { duration })

  let isOpen = false

  $: if (active) {
    toggle()
    setTimeout(() => (active = false), 2000)
  }

  function toggle() {
    isOpen = !isOpen
    angle.set(isOpen ? 0 : 180)
  }
</script>

<h3 on:click={toggle} style="--angle: {$angle}" class:active>
  <span class="anchor" {id} />
  {title}
  <span style="display:inline-block; transform: rotate({$angle}deg);">👆</span>
</h3>
{#if isOpen}
  <div transition:slide={{ duration }}>
    <slot />
  </div>
{/if}

<style>
  h3 {
    cursor: pointer;
    background: var(--lightBg);
    border-radius: 4pt;
    padding: 4pt 1ex;
    margin: 1em auto;
    transition: 0.3s;
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
