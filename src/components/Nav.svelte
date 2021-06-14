<script>
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'
  import QuestionAnswer from '@svicons/material-sharp/question-answer.svelte'
  import PeopleCircle from '@svicons/ionicons-solid/people-circle.svelte'
  import Rss from '@svicons/fa-solid/rss-square.svelte'
  import Place from '@svicons/material-sharp/place.svelte'
  import Plant from '@svicons/remix-fill/plant.svelte'
  import Menu from '@svicons/heroicons-solid/menu.svelte'
  import ChevronExpand from '@svicons/bootstrap/chevron-expand.svelte'
  import AlternateEmail from '@svicons/material-sharp/alternate-email.svelte'
  import HandsHelping from '@svicons/fa-solid/hands-helping.svelte'

  import { onClickOutside } from '../utils/actions'

  export let nav

  const icons = {
    'Über Uns': Plant,
    Standorte: Place,
    FAQ: QuestionAnswer,
    Mitmachen: PeopleCircle,
    Blog: Rss,
    Kontakt: AlternateEmail,
    Internes: HandsHelping,
  }

  let isOpen = false
  let activeSubNav = null
  let viewWidth, hovered
  const close = () => {
    isOpen = false
    hovered = null
  }

  const setActiveSubNav = (idx) => () => {
    if (activeSubNav !== idx) activeSubNav = idx
    else activeSubNav = null
  }

  // isCurrent needs to be reactive to respond to changes in $page.path
  $: isCurrent = (url) => {
    if (url === $page.path) return `page`
    if (url !== `/` && $page.path.includes(url)) return `page`
    return undefined
  }
  page.subscribe(close)
</script>

<svelte:window bind:innerWidth={viewWidth} />

<button
  on:click|preventDefault={() => (isOpen = true)}
  aria-label="Navigationsmenü öffnen"
  style="grid-area: nav;">
  <Menu height="3ex" />
</button>

<a
  on:click={close}
  class="logo"
  href="/"
  sveltekit:prefetch
  aria-current={isCurrent(`/`)}>
  <img src="/favicon.svg" alt="SbS Logo" height="50" width="50" />
</a>

<nav class:isOpen use:onClickOutside={close}>
  <ul>
    {#each nav as { title, url, subNav }, idx}
      <li
        on:mouseenter={() => (hovered = idx)}
        on:mouseleave={() => (hovered = null)}
        class:hover={hovered === idx}>
        <span>
          <a on:click={close} sveltekit:prefetch aria-current={isCurrent(url)} href={url}>
            <svelte:component
              this={icons[title]}
              style="padding-right: 4pt; height: 1em;" />
            {title}</a>
          {#if subNav}
            <button on:click={setActiveSubNav(idx)} aria-label="Untermenü {title} öffnen">
              <ChevronExpand height="20" />
            </button>
          {/if}
        </span>
        {#if subNav && (activeSubNav === idx || viewWidth > 1000)}
          <ul
            transition:slide
            style="grid-template-columns: repeat({Math.min(
              Math.ceil(subNav.length / 10),
              4
            )}, 1fr);">
            {#each subNav as { title, url, spanCols, lightFont }}
              <li class:spanCols class:lightFont>
                <a
                  on:click={close}
                  sveltekit:prefetch
                  aria-current={isCurrent(url)}
                  href={url}>{title}</a>
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
  a,
  button {
    transition: 0.4s;
    color: var(--headerColor);
    border-radius: 50%;
  }
  a:hover {
    color: var(--hoverColor);
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
    color: var(--headerColor);
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
  @media (max-width: 1000px) {
    /* mobile styles */
    nav {
      position: fixed;
      top: 1em;
      left: 1em;
      padding: 1em;
      transition: 0.4s;
      max-height: calc(100vh - 2em);
      background: var(--headerBg);
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
    }
    a.logo {
      /* needed for centering logo since menu button takes less space than colormode + search */
      margin-left: 4vw;
    }
  }
  @media (min-width: 1001px) {
    /* desktop styles */
    nav,
    nav > ul {
      display: contents;
    }
    nav > ul > li {
      position: relative;
    }
    nav > ul > li > ul {
      position: absolute;
      background: var(--headerBg);
      padding: 1ex 1em;
      border-radius: 1ex;
      box-shadow: 0 0 1em black;
      top: 3ex;
      visibility: hidden;
      opacity: 0;
      transition: 0.3s;
      display: grid;
      gap: 5pt 1em;
      width: max-content;
      max-height: 80vh;
      overflow-y: auto;
      overscroll-behavior: none;
    }
    nav > ul > li > ul > li.spanCols {
      grid-column: 1/-1;
      border-top: 1px solid var(--headerColor);
      padding-top: 6pt;
      margin-top: 6pt;
    }
    nav > ul > li.hover > ul {
      visibility: visible;
      opacity: 1;
    }
    button:first-child {
      display: none;
    }
  }
</style>
