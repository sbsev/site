<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'

  import { preventOverScroll } from '../utils/actions'

  export let style
  export let showCloseBtn = false

  const dispatch = createEventDispatcher()
  const close = () => dispatch(`close`)

  let modal, origScrollPos
  // record original scroll position to return to when modal closes (see onDestroy)
  onMount(() => {
    origScrollPos = [window.scrollX, window.scrollY]
  })

  const previouslyFocused = typeof document !== `undefined` && document.activeElement
  onDestroy(() => {
    if (previouslyFocused) previouslyFocused.focus()
    window.scrollTo(...origScrollPos)
  })

  const handleKeydown = (event) => {
    if (event.key === `Escape`) return close()

    if (event.key === `Tab`) {
      // trap focus
      const nodes = modal.querySelectorAll(`*`)
      const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0)

      let index = tabbable.indexOf(document.activeElement)
      if (index === -1 && event.shiftKey) index = 0

      index += tabbable.length + (event.shiftKey ? -1 : 1)
      index %= tabbable.length

      tabbable[index].focus()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-background" on:click|self={close}>
  <div
    use:preventOverScroll
    class="modal"
    role="dialog"
    aria-modal="true"
    bind:this={modal}
    {style}>
    {#if showCloseBtn}<button on:click={close}><span>&times;</span></button>{/if}
    <slot />
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: grid;
  }
  .modal {
    position: absolute;
    place-self: center;
    width: calc(100vw - 8em);
    max-width: 40em;
    max-height: calc(100vh - 8em);
    overflow: auto;
    padding: 1em;
    border-radius: 5pt;
    background: rgba(0, 0, 0, 0.6);
  }
  button {
    position: absolute;
    top: 0;
    right: 0;
    background: teal;
    border-radius: 50%;
    color: white;
  }
  button span {
    transform: scale(3);
    display: block;
  }
</style>
