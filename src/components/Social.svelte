<script lang="ts">
  import Facebook from '~icons/fa-brands/facebook'
  import Github from '~icons/fa-brands/github'
  import Instagram from '~icons/fa-brands/instagram'
  import Linkedin from '~icons/fa-brands/linkedin'
  import Twitter from '~icons/fa-brands/twitter'
  import Xing from '~icons/fa-brands/xing-square'
  import Youtube from '~icons/fa-brands/youtube'
  import Email from '~icons/ic/email'

  export let social: Record<keyof typeof icons, string>
  export let style = ``
  export let vertical = false
  export let fixed = false
  export let include: (keyof typeof icons)[] = [
    `Facebook`,
    `Twitter`,
    `Instagram`,
    `Youtube`,
    `Linkedin`,
  ]

  const icons = { Facebook, Github, Instagram, Linkedin, Twitter, Xing, Youtube, Email }
</script>

<div {style} class:vertical class:fixed>
  {#each include as key}
    <a href={social[key]} aria-label={key}>
      <svelte:component this={icons[key]} />
    </a>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-items: center;
    line-height: 0;
  }
  div.vertical {
    flex-direction: column;
  }
  div.fixed {
    position: fixed;
    z-index: 1;
    background: var(--accentBg);
    padding: 1ex;
  }
  div.fixed.vertical {
    right: 0;
    border-radius: 1ex 0 0 1ex;
    top: 50%;
    transform: translateY(-50%);
  }
  @media (max-width: 1150px) {
    div.fixed {
      display: none;
    }
  }
  a {
    transition: 0.2s;
  }
  a:hover {
    transform: scale(1.04);
  }
</style>
