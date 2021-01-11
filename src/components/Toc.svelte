<script>
  import { throttle } from 'lodash'
  import { onMount } from 'svelte'
  import { blur } from 'svelte/transition'

  import Menu from '@svg-icons/heroicons-solid/menu.svg'
  import CircleWithCross from '@svg-icons/entypo/circle-with-cross.svg'

  function accumulateOffsetTop(el, totalOffset = 0) {
    while (el) {
      totalOffset += el.offsetTop - el.scrollTop + el.clientTop
      el = el.offsetParent
    }
    return totalOffset
  }

  // the default selector relies on BasePage.svelte wrapping body content in <article>
  export let headingSelector = Array.from({ length: 6 }, (_, i) => `article h` + (i + 1))
  export let getTitle = (node) => node.innerText
  export let getDepth = (node) => Number(node.nodeName[1])

  let windowWidth
  let open = false
  let activeHeading = false
  let headings = []
  let nodes = []

  onMount(() => {
    nodes = Array.from(document.querySelectorAll(headingSelector))
    const depths = nodes.map(getDepth)
    const minDepth = Math.min(...depths)

    headings = nodes.map((node, idx) => ({
      title: getTitle(node),
      depth: depths[idx] - minDepth,
    }))
    scrollHandler()
  })

  const scrollHandler = throttle(() => {
    // Offsets need to be recomputed because lazily-loaded
    // content may increase offsets as user scrolls down.
    const offsets = nodes.map((el) => accumulateOffsetTop(el))
    const activeIndex = offsets.findIndex(
      (offset) => offset > window.scrollY + 0.6 * window.innerHeight
    )
    activeHeading = activeIndex === -1 ? headings.length - 1 : activeIndex - 1
  }, 300)
</script>

<svelte:window on:scroll={scrollHandler} bind:innerWidth={windowWidth} />

<aside>
  <button on:click={() => (open = !open)} aria-label="Inhaltsverzeichnis öffnen">
    {#if open}
      <CircleWithCross height="40" />
    {:else}
      <Menu height="40" />
    {/if}
  </button>
  {#if open || windowWidth > 1600}
    <nav transition:blur>
      {#each headings as { title, depth }, idx}
        <li
          style="margin-left: {depth}em; font-size: {1.8 - 0.2 * depth}ex"
          class:active={activeHeading === idx}
          on:click={() => {
            open = false
            nodes[idx].scrollIntoView({ behavior: `smooth`, block: `center` })
          }}>
          {title}
        </li>
      {/each}
    </nav>
  {/if}
</aside>

<style>
  aside {
    z-index: 1;
  }
  nav {
    list-style: none;
    max-height: 90vh;
    overflow: auto;
    overscroll-behavior: contain;
  }
  nav > li {
    margin-top: 5pt;
    cursor: pointer;
    color: var(--linkColor);
  }
  nav > li.active {
    color: var(--darkGreen);
  }
  button {
    color: var(--linkColor);
    display: flex;
    background: var(--accentBg);
    border-radius: 50%;
    padding: 2pt;
    box-shadow: 0 0 1em -3pt black;
  }
  nav {
    position: absolute;
    width: 11em;
    margin: 2em 1em;
    padding: 5pt 1ex 1ex 1.5ex;
    background: var(--accentBg);
    border-radius: 6pt;
  }
  @media (max-width: 1600px) {
    /* mobile styles */
    aside {
      position: fixed;
      bottom: 1em;
      right: 1em;
    }
    nav {
      bottom: -1em;
      right: 0;
      z-index: -1;
    }
  }
  @media (min-width: 1601px) {
    /* desktop styles */
    aside {
      position: sticky;
      top: 7ex;
    }
    nav {
      left: calc(100% + 2ex);
    }
    aside > button {
      display: none;
    }
  }
</style>
