<script>
  import { stores } from '@sapper/app'
  import { slide } from 'svelte/transition'
  import Euro from '@svg-icons/material-sharp/euro.svg'
  // import Donate from '@svg-icons/fa-solid/donate.svg'
  // import DonateHeart from '@svg-icons/boxicons-solid/donate-heart.svg'
  import QaA from '@svg-icons/material-rounded/question-answer.svg'
  import PeopleCircle from '@svg-icons/ionicons-solid/people-circle.svg'
  import Rss from '@svg-icons/fa-solid/rss-square.svg'
  import Contact from '@svg-icons/boxicons-solid/contact.svg'
  import Place from '@svg-icons/material-filled/place.svg'
  import Plant from '@svg-icons/remix-fill/plant.svg'
  import Menu from '@svg-icons/heroicons-solid/menu.svg'
  import ChevronExpand from '@svg-icons/bootstrap/chevron-expand.svg'

  import { onClickOutside, preventOverScroll } from '../utils/actions'

  export let nav

  const icons = {
    Verein: Plant,
    Standorte: Place,
    Spenden: Euro,
    FAQ: QaA,
    Mitmachen: PeopleCircle,
    Blog: Rss,
    Kontakt: Contact,
  }

  let isOpen = false
  const close = () => (isOpen = false)
  let activeSubNav = null
  let resultsDiv
  let viewWidth

  const setActiveSubNav = (idx) => () => {
    if (activeSubNav !== idx) activeSubNav = idx
    else activeSubNav = null
  }

  const { page } = stores()
  const isCurrent = (url) => (url === $page.path ? `page` : undefined)
</script>

<svelte:window bind:innerWidth={viewWidth} />

<button on:click|preventDefault={() => (isOpen = true)}>
  <Menu height="2.9ex" style="vertical-align: middle;" />
</button>

<a
  on:click={close}
  class="logo"
  href="/"
  rel="prefetch"
  aria-current={isCurrent(`/`)}><img src="favicon.svg" alt="SbS Logo" height="55" /></a>

<nav class:isOpen use:onClickOutside={close} use:preventOverScroll bind:this={resultsDiv}>
  <ul>
    {#each nav as { title, url, subNav }, idx}
      <li>
        <a on:click={close} rel="prefetch" aria-current={isCurrent(url)} href={url}>
          <svelte:component
            this={icons[title]}
            height="1em"
            style="vertical-align: -3pt; padding-right: 2pt;" />
          {title}</a>
        {#if subNav}
          <button on:click={setActiveSubNav(idx)}>
            <ChevronExpand
              height="1em"
              style="vertical-align: text-bottom; color: var(--green);" />
          </button>
        {/if}
        {#if subNav && (activeSubNav === idx || viewWidth > 900)}
          <ul
            transition:slide
            style="grid-template-columns: {`1fr `.repeat(Math.ceil(subNav.length / 14))};">
            {#each subNav as { title, url, span }}
              <li class:span>
                <a
                  on:click={close}
                  rel="prefetch"
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
  }
  a:hover {
    color: var(--hoverColor);
  }
  a[aria-current] {
    border-radius: 1ex;
    padding: 3pt 5pt;
    line-height: 0;
    background: var(--linkColor);
    color: white;
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
  @media (max-width: 900px) {
    /* mobile styles */
    nav {
      position: fixed;
      top: 1em;
      left: 1em;
      background: var(--accentBg);
      padding: 1em;
      transition: 0.4s;
      max-height: calc(100vh - 2em);
      overflow: scroll;
      background: var(--headerBg);
      transform: translate(-120%);
      box-sizing: border-box;
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
  @media (min-width: 901px) {
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
      transition: 0.4s;
      display: grid;
      gap: 5pt 1em;
      width: max-content;
    }
    nav > ul > li > ul > li.span {
      grid-column: 1/-1;
      border-top: 1px solid var(--headerColor);
      padding-top: 6pt;
      margin-top: 6pt;
    }
    nav > ul > li:hover > ul {
      visibility: visible;
      opacity: 1;
    }
    button:first-child {
      display: none;
    }
  }
</style>
