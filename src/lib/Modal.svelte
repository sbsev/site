<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte'
  import { preventOverScroll } from '../utils/actions'

  interface Props {
    style: string
    show_close_btn?: boolean
    onclose?: () => void
    children: Snippet
  }

  let { style, show_close_btn = false, onclose, children }: Props = $props()

  const close = () => onclose?.()

  let modal: HTMLDivElement = $state(null!)
  let origScrollPos: [number, number] = $state([0, 0])
  let origActiveElement: HTMLElement | null = $state(null)

  // record original scroll position and focused element
  // to return to when modal closes (see onDestroy)
  onMount(() => {
    origScrollPos = [window.scrollX, window.scrollY]
    origActiveElement = document.activeElement as HTMLElement
  })

  onDestroy(() => {
    if (origActiveElement) origActiveElement.focus()
    window.scrollTo(...origScrollPos)
  })

  const handle_keydown = (event: KeyboardEvent) => {
    if (event.key === `Escape`) return close()

    if (event.key === `Tab`) {
      // trap focus inside the modal
      const nodes = modal.querySelectorAll<HTMLElement>(`*`) // get all the modal's child nodes
      const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0)

      const activeEl = document?.activeElement
      if (activeEl) {
        let index = tabbable.indexOf(activeEl as HTMLElement)
        if (index === -1 && event.shiftKey) index = 0

        index += tabbable.length + (event.shiftKey ? -1 : 1)
        index %= tabbable.length

        tabbable[index].focus()
      }
    }
  }
</script>

<svelte:window onkeydown={handle_keydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="modal-background"
  onclick={(e) => { if (e.target === e.currentTarget) close() }}
  onkeyup={(e) => { if (e.target === e.currentTarget) close() }}
  role="presentation"
>
  <div
    use:preventOverScroll
    class="modal"
    role="alertdialog"
    aria-modal="true"
    bind:this={modal}
    {style}
  >
    {#if show_close_btn}<button onclick={close}><span>&times;</span></button>{/if}
    {@render children()}
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    background: var(--zoo-modal-bg-behind, rgba(0, 0, 0, 0.6));
  }
  .modal {
    position: absolute;
    place-self: center;
    overflow: auto;
    padding: 1em;
    border-radius: 5pt;
    box-sizing: border-box;
    width: var(--zoo-modal-width, 90vw);
    max-width: var(--zoo-modal-max-width, 50em);
    max-height: var(--zoo-modal-max-height, 90vh);
    background: var(--zoo-modal-bg, rgba(0, 0, 0, 0.6));
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
