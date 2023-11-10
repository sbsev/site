<script lang="ts">
  import Icon from '@iconify/svelte'
  import { microcopy } from './stores'

  export let social: Record<string, string>
  export let style = ``
  export let vertical = false
  export let fixed = false
  export let social_icons: Record<string, string> =
    $microcopy?.icons?.global?.socials ?? {}
</script>

<div {style} class:vertical class:fixed>
  {#each Object.entries(social_icons) as [key, value]}
    <a href={social[key]} aria-label={key}>
      <Icon icon={value} />
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
