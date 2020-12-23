<script>
  import Facebook from '@svg-icons/fa-brands/facebook.svg'
  import Github from '@svg-icons/fa-brands/github.svg'
  import Instagram from '@svg-icons/fa-brands/instagram.svg'
  import Linkedin from '@svg-icons/fa-brands/linkedin.svg'
  import Twitter from '@svg-icons/fa-brands/twitter.svg'
  import Xing from '@svg-icons/fa-brands/xing-square.svg'
  import Youtube from '@svg-icons/fa-brands/youtube.svg'
  import Email from '@svg-icons/material-rounded/email.svg'

  export let social, style

  const icons = { Facebook, Github, Instagram, Linkedin, Twitter, Xing, Youtube, Email }
</script>

<div {style}>
  {#each Object.entries(social) as [key, url]}
    <a href={url}>
      <svelte:component this={icons[key]} height="2.5ex" /></a>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
    line-height: 0;
  }
  a {
    transition: 0.4s;
  }
  a:hover {
    transform: scale(1.02);
  }
</style>
