<script>
  import { stores } from '@sapper/app'
  import { slide } from 'svelte/transition'
  import Euro from '@svg-icons/material-sharp/euro.svg'
  import QuestionAnswer from '@svg-icons/material-sharp/question-answer.svg'
  import PeopleCircle from '@svg-icons/ionicons-solid/people-circle.svg'
  import Rss from '@svg-icons/fa-solid/rss-square.svg'
  import Contact from '@svg-icons/boxicons-solid/contact.svg'
  import Place from '@svg-icons/material-sharp/place.svg'
  import Plant from '@svg-icons/remix-fill/plant.svg'
  import Menu from '@svg-icons/heroicons-solid/menu.svg'
  import ChevronExpand from '@svg-icons/bootstrap/chevron-expand.svg'

  import { onClickOutside } from '../utils/actions'

  export let nav

  const icons = {
    'Über Uns': Plant,
    Standorte: Place,
    Spenden: Euro,
    FAQ: QuestionAnswer,
    Mitmachen: PeopleCircle,
    Blog: Rss,
    Kontakt: Contact,
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

  const { page } = stores()
  // isCurrent needs to be reactive to respond to changes in $page.path
  $: isCurrent = (url) => {
    if (url === $page.path) return `page`
    if (url !== `/` && $page.path.includes(url)) return `page`
    return undefined
  }
</script>

<svelte:window bind:innerWidth={viewWidth} />

<button
  on:click|preventDefault={() => (isOpen = true)}
  aria-label="Navigationsmenü öffnen">
  <Menu height="2.9ex" style="vertical-align: middle;" />
</button>

<a on:click={close} class="logo" href="/" sapper:prefetch aria-current={isCurrent(`/`)}
  ><img src="favicon.svg" alt="SbS Logo" style="height: 2em;" /></a>

<nav class:isOpen use:onClickOutside={close}>
  <ul>
    {#each nav as { title, url, subNav }, idx}
      <li
        on:mouseenter={() => (hovered = idx)}
        on:mouseleave={() => (hovered = null)}
        class:hover={hovered === idx}>
        <a on:click={close} sapper:prefetch aria-current={isCurrent(url)} href={url}>
          <svelte:component
            this={icons[title]}
            height="1em"
            style="vertical-align: middle; padding-right: 2pt;" />
          {title}</a>
        {#if subNav}
          <button on:click={setActiveSubNav(idx)} aria-label="Untermenü {title} öffnen">
            <ChevronExpand
              height="1em"
              style="vertical-align: middle; color: var(--green);" />
          </button>
        {/if}
        {#if subNav && (activeSubNav === idx || viewWidth > 1000)}
          <ul
            transition:slide
            style="grid-template-columns: repeat({Math.ceil(subNav.length / 13)}, 1fr);">
            {#each subNav as { title, url, span }}
              <li class:span>
                <a
                  on:click={close}
                  sapper:prefetch
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
    grid-area: nav;
    padding: 0;
  }
  a,
  button {
    transition: 0.4s;
    color: var(--headerColor);
    border-radius: 50%;
  }
  button:hover {
    background: var(--gray);
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
    padding: 2pt;
    display: flex;
  }
  ul {
    list-style: none;
  }
  li::marker {
    color: var(--headerColor);
  }
  nav > ul > li > ul {
    padding-left: 2ex;
  }
  nav {
    overflow: auto;
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
    nav > ul > li > ul > li.span {
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
