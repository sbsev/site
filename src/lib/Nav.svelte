<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import Icon from '@iconify/svelte'
  import { slide } from 'svelte/transition'
  import type { NavLink } from './types'

  let { nav, mobile } = $props<{ nav: NavLink[]; mobile: boolean }>()

  const icon_map: Record<string, string> = {
    'Über Uns': `ri:plant-fill`,
    Standorte: `ic:place`,
    Mitmachen: `ion:people-circle`,
    Blog: `fa-solid:rss-square`,
    Kontakt: `ic:round-alternate-email`,
    Internes: `fa-solid:hands-helping`,
    Anmeldung: `ic:round-assignment-ind`,
  }

  let isOpen = $state(false)
  let activeSubNav = $state(-1)
  let node: HTMLElement

  const close = () => {
    isOpen = false
    activeSubNav = -1
  }

  const setActiveSubNav = (idx: number) => () => {
    // if activeSubNav already is idx, we want to close the subnav to get toggle behavior on mobile
    if (activeSubNav === idx) activeSubNav = -1
    else activeSubNav = idx
  }

  const toggleSubNav = (idx: number) => () => {
    // if activeSubNav already is idx, we want to close the subnav to get toggle behavior on mobile
    if (activeSubNav === idx) activeSubNav = -1
    else activeSubNav = idx
  }

  // isCurrent needs to be reactive to respond to changes in $page.url.pathname
  const isCurrent = $derived((url: string) => {
    // Only access page store on the client to avoid SSR issues
    if (typeof window === `undefined`) return undefined
    if (url === $page.url.pathname) return `page`
    if (url !== `/` && $page.url.pathname.includes(url)) return `page`
    return undefined
  })
  beforeNavigate(close)

  const crawl_links = nav.flatMap((itm) => itm?.subNav ?? [])
</script>

<svelte:window
  on:click={(event) => {
    if (!node.contains(event.target)) close()
  }}
/>

{#each crawl_links as { title, url }}
  <a
    href={url}
    style="position: absolute; visibility: hidden;"
    aria-hidden="true"
    tabindex="-1">{title}</a
  >
{/each}

<!-- Mobile menu button - shown via CSS media query -->
<button
  class="mobile-menu-btn"
  on:click|preventDefault|stopPropagation={() => (isOpen = true)}
  aria-label="Navigationsmenü öffnen"
  style="grid-area: nav;"
>
  <Icon icon="heroicons-solid:menu" />
</button>

<a on:click={close} class="logo" href="/" aria-current={isCurrent(`/`)}>
  <img src="/favicon.svg" alt="ST Logo" height="50" width="50" />
</a>

<nav class:isOpen bind:this={node}>
  <ul>
    {#each nav as { title, url, subNav }, idx}
      <li
        on:mouseenter={mobile ? null : setActiveSubNav(idx)}
        on:mouseleave={mobile ? null : setActiveSubNav(-1)}
      >
        <span>
          <a
            on:click={close}
            aria-current={isCurrent(url)}
            href={url}
            style="display: flex; align-items: center;"
          >
            <Icon icon={icon_map[title]} style="margin: 0 5pt 0 0;" />
            {title}
          </a>
          {#if subNav}
            <button
              on:click={toggleSubNav(idx)}
              aria-label="Untermenü {title} öffnen"
            >
              <Icon icon="bi:chevron-expand" />
            </button>
          {/if}
        </span>
        {#if subNav && activeSubNav === idx}
          <!-- TODO: use media query to check if user prefers reduced motion and toggle (not slide) if so -->
          <ul
            transition:slide
            style="grid-template-columns: repeat({Math.min(
              Math.ceil(subNav.length / 10),
              4
            )}, 1fr);"
          >
            {#each subNav as { title, url, spanCols, lightFont }}
              <li class:spanCols class:lightFont>
                <a on:click={close} aria-current={isCurrent(url)} href={url}>
                  {title}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  button {
    display: flex;
  }
  /* Mobile menu button - hidden on desktop via media query */
  button.mobile-menu-btn {
    display: flex;
  }
  a,
  button {
    color: var(--header-color);
    border-radius: 5pt;
    padding: 0 3pt;
  }
  a:hover {
    color: var(--hover-color);
  }
  a[aria-current] {
    color: var(--orange);
  }
  a.logo {
    grid-area: logo;
    border-radius: 50%;
    margin: 2pt;
    display: flex;
  }
  ul {
    list-style: none;
  }
  li::marker {
    color: var(--header-color);
  }
  nav {
    overflow: auto;
  }
  nav > ul > li > span {
    display: flex;
    place-items: center;
  }
  nav > ul > li > span > a {
    display: contents;
  }
  nav > ul > li > span > button {
    margin-left: 3pt;
    padding: 1pt;
    color: var(--green);
  }
  nav > ul > li > span > button:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  nav > ul > li > ul > li.lightFont {
    font-weight: lighter;
    opacity: 0.6;
  }

  /* Desktop styles (default) */
  button.mobile-menu-btn {
    display: none;
  }
  nav,
  nav > ul {
    display: contents;
  }
  nav > ul > li {
    position: relative;
  }
  nav > ul > li > ul {
    position: absolute;
    background: var(--header-bg);
    padding: 1ex 1em;
    border-radius: 1ex;
    box-shadow: 0 0 1em black;
    top: 100%;
    margin-top: 0;
    display: grid;
    gap: 5pt 1em;
    max-height: 80vh;
    overflow-y: auto;
    overscroll-behavior: none;
  }
  nav > ul > li > ul > li.spanCols {
    grid-column: 1/-1;
    border-top: 1px solid var(--header-color);
    padding-top: 6pt;
    margin-top: 6pt;
  }

  /* Mobile styles via media query - no JS flash! */
  @media (max-width: 1100px) {
    button.mobile-menu-btn {
      display: flex;
    }
    nav {
      position: fixed;
      top: 1em;
      left: 1em;
      padding: 1em;
      transition: 0.4s;
      max-height: calc(100vh - 2em);
      background: var(--header-bg);
      transform: translate(-120%);
      box-sizing: border-box;
      overscroll-behavior: none;
    }
    nav.isOpen {
      box-shadow: 0 0 1em black;
      transform: translate(0);
    }
    nav > ul {
      display: grid;
      grid-gap: 1em;
      padding: 0;
      margin: 0;
    }
    nav > ul > li > ul {
      margin-top: 1ex;
      list-style: disc;
      padding-left: 2ex;
      position: static;
      box-shadow: none;
      padding: 0;
      border-radius: 0;
    }
  }
</style>
