<script>
  import { throttle } from 'lodash'
  import { onMount } from 'svelte'
  import { blur } from 'svelte/transition'

  import Menu from '@svg-icons/heroicons-solid/menu.svg'
  import CircleWithCross from '@svg-icons/entypo/circle-with-cross.svg'

  import { preventOverScroll } from '../utils/actions'

  function accumulateOffsetTop(el, totalOffset = 0) {
    while (el) {
      totalOffset += el.offsetTop - el.scrollTop + el.clientTop
      el = el.offsetParent
    }
    return totalOffset
  }

  // the default selector relies on BasePage.svelte wrapping body content in <article>
  export let headingSelector = Array.from({ length: 6 }, (_, i) => `article h` + (i + 1))
  export let getTitle, getDepth

  let windowWidth
  let open = false
  let activeHeading = false
  let headings = []
  let nodes = []

  onMount(() => {
    nodes = Array.from(document.querySelectorAll(headingSelector))
    const depths = nodes.map((node) =>
      getDepth ? getDepth(node) : Number(node.nodeName[1])
    )
    const minDepth = Math.min(...depths)

    headings = nodes.map((node, idx) => ({
      title: getTitle ? getTitle(node) : node.innerText,
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

<aside use:preventOverScroll>
  <button on:click={() => (open = !open)}>
    {#if open}
      <CircleWithCross height="50" />
    {:else}
      <Menu height="50" />
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
  nav {
    list-style: none;
  }
  nav > li {
    margin-top: 5pt;
    cursor: pointer;
    color: var(--linkColor);
  }
  nav > li.active {
    color: var(--buttonBg);
  }
  button {
    color: var(--linkColor);
    display: flex;
    background: var(--accentBg);
    border-radius: 50%;
    padding: 2pt;
    box-shadow: 0 0 1em black;
  }
  nav {
    position: absolute;
    width: 11em;
    margin: 2em 1em;
    padding: 5pt 1ex;
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
