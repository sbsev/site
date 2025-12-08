<script lang="ts">
  // import Icon from '@iconify/svelte'
  import IconFacebook from '~icons/fa-brands/facebook'
  import IconTwitter from '~icons/fa-brands/twitter'
  import IconInstagram from '~icons/fa-brands/instagram'
  import IconYoutube from '~icons/fa-brands/youtube'
  import IconLinkedin from '~icons/fa-brands/linkedin'

  interface Props {
    social: Record<string, string>
    style?: string
    vertical?: boolean
    fixed?: boolean
    include?: string[]
  }

  let {
    social,
    style = ``,
    vertical = false,
    fixed = false,
    include = [`Facebook`, `Twitter`, `Instagram`, `Youtube`, `Linkedin`]
  }: Props = $props()

  const icons: Record<string, any> = {
    Facebook: IconFacebook,
    Twitter: IconTwitter,
    Instagram: IconInstagram,
    Youtube: IconYoutube,
    Linkedin: IconLinkedin
  }
</script>

<div {style} class:vertical class:fixed>
  {#each include as key}
    {#if social[key] && icons[key]}
      <a href={social[key]} aria-label={key}>
        <svelte:component this={icons[key]} />
      </a>
    {/if}
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
    background: var(--accent-bg);
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
