<script>
  import Facebook from '@svicons/fa-brands/facebook.svelte'
  import Github from '@svicons/fa-brands/github.svelte'
  import Instagram from '@svicons/fa-brands/instagram.svelte'
  import Linkedin from '@svicons/fa-brands/linkedin.svelte'
  import Twitter from '@svicons/fa-brands/twitter.svelte'
  import Xing from '@svicons/fa-brands/xing-square.svelte'
  import Youtube from '@svicons/fa-brands/youtube.svelte'
  import Email from '@svicons/material-sharp/email.svelte'

  export let social
  export let style = ``
  export let vertical = false
  export let fixed = false
  export let include = [`Facebook`, `Twitter`, `Instagram`, `Youtube`, `Linkedin`]

  const icons = { Facebook, Github, Instagram, Linkedin, Twitter, Xing, Youtube, Email }
</script>

<div {style} class:vertical class:fixed>
  {#each include as key}
    <a href={social[key]} aria-label={key}>
      <svelte:component this={icons[key]} height="2.5ex" /></a>
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
