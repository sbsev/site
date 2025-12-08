<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'
  import type { NavLink } from './types'

  // Icon imports (bundled)
  import IconChevronExpand from '~icons/bi/chevron-expand'
  import IconRssSquare from '~icons/fa-solid/rss-square'
  import IconMenu from '~icons/heroicons-solid/menu'
  import IconPlace from '~icons/ic/place'
  import IconAlternateEmail from '~icons/ic/round-alternate-email'
  import IconAssignmentInd from '~icons/ic/round-assignment-ind'
  import IconPeopleCircle from '~icons/ion/people-circle'
  import IconPlantFill from '~icons/ri/plant-fill'
  import IconHandsHelping from '~icons/fa-solid/hands-helping'

  interface Props {
    nav: NavLink[]
    mobile: boolean
  }

  let { nav, mobile }: Props = $props()

  // Map titles to components
   const icon_map: Record<string, any> = {
    'Über Uns': IconPlantFill,
    Standorte: IconPlace,
    Mitmachen: IconPeopleCircle,
    Blog: IconRssSquare,
    Kontakt: IconAlternateEmail,
    Internes: IconHandsHelping,
    Anmeldung: IconAssignmentInd,
  }

  let isOpen = $state(false)
  let activeSubNav = $state(-1)
  let node: HTMLElement

  const close = () => {
    isOpen = false
    activeSubNav = -1
  }

  const setActiveSubNav = (idx: number) => () => {
    if (activeSubNav === idx) activeSubNav = -1
    else activeSubNav = idx
  }

  const toggleSubNav = (idx: number) => () => {
    if (activeSubNav === idx) activeSubNav = -1
    else activeSubNav = idx
  }

  const isCurrent = $derived((url: string) => {
    if (typeof window === `undefined`) return undefined
    if (url === $page.url.pathname) return `page`
    if (url !== `/` && $page.url.pathname.includes(url)) return `page`
    return undefined
  })
  beforeNavigate(close)

  const crawl_links = $derived(nav.flatMap((itm) => itm?.subNav ?? []))
</script>

<svelte:window
  onclick={(event) => {
    if (node && !node.contains(event.target as Node)) close()
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

<button
  class="mobile-menu-btn"
  onclick={(e) => { e.preventDefault(); e.stopPropagation(); isOpen = true }}
  aria-label="Navigationsmenü öffnen"
  style="grid-area: nav;"
>
  <IconMenu />
</button>

<a onclick={close} class="logo" href="/" aria-current={isCurrent(`/`)}>
  <img src="/favicon.svg" alt="ST Logo" height="50" width="50" />
</a>

<nav class:isOpen bind:this={node}>
  <ul>
    {#each nav as { title, url, subNav }, idx}
      <li
        onmouseenter={mobile ? undefined : setActiveSubNav(idx)}
        onmouseleave={mobile ? undefined : setActiveSubNav(-1)}
      >
        <span>
          <a
            onclick={close}
            aria-current={isCurrent(url)}
            href={url}
            style="display: flex; align-items: center;"
          >
            <!-- Using component from map -->
            {#if icon_map[title]}
               <span style="display: inline-flex; margin: 0 5pt 0 0;">
                 <svelte:component this={icon_map[title]} />
               </span>
            {/if}
            {title}
          </a>
          {#if subNav}
            <button
              onclick={toggleSubNav(idx)}
              aria-label="Untermenü {title} öffnen"
            >
              <IconChevronExpand />
            </button>
          {/if}
        </span>
        {#if subNav && activeSubNav === idx}
          <ul
            transition:slide
            style="grid-template-columns: repeat({Math.min(
              Math.ceil(subNav.length / 10),
              4
            )}, 1fr);"
          >
            {#each subNav as { title: subTitle, url: subUrl, spanCols, lightFont }}
              <li class:spanCols class:lightFont>
                <a onclick={close} aria-current={isCurrent(subUrl)} href={subUrl}>
                  {subTitle}
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
