<script>
  import { stores } from '@sapper/app'
  import Euro from '@svg-icons/material-sharp/euro.svg'
  // import Donate from '@svg-icons/fa-solid/donate.svg'
  // import DonateHeart from '@svg-icons/boxicons-solid/donate-heart.svg'
  import QaA from '@svg-icons/material-rounded/question-answer.svg'
  import PeopleCircle from '@svg-icons/ionicons-solid/people-circle.svg'
  import Rss from '@svg-icons/fa-solid/rss-square.svg'
  import Contact from '@svg-icons/boxicons-solid/contact.svg'
  import Place from '@svg-icons/material-filled/place.svg'
  import Plant from '@svg-icons/remix-fill/plant.svg'

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
  const { page } = stores()
</script>

<nav>
  {#each nav as { title, url }}
    <a rel="prefetch" aria-current={url === $page.path ? `page` : undefined} href={url}>
      <svelte:component
        this={icons[title]}
        height="1em"
        style="vertical-align: -3pt; padding-right: 2pt;" />
      {title}</a>
  {/each}
</nav>

<style>
  nav {
    display: contents;
  }
  a {
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
</style>
