<script lang="ts">
  import { repository } from '$root/package.json'
  import Icon from '@iconify/svelte'
  import { Social } from '.'
  import { microcopy } from './stores'
  import type { Link } from './types'

  const icon_map: Record<string, string> = {
    Impressum: `octicon:law`,
    Datenschutz: `ic:round-privacy-tip`,
    Spenden: `ic:round-euro`,
    Satzung: `ion:document-text`,
  }

  export let links: Link[]
  export let social: Record<keyof typeof icon_map, string>
</script>

<footer>
  <img src="/favicon.svg" alt="ST Logo" height="60" />
  <span>© {new Date().getFullYear()} {$microcopy?.footer?.name}</span>
  <div>
    {#each links as { title, url }}
      <a href={url}>
        <Icon inline icon={icon_map[title]} />
        {title}
      </a>
    {/each}
  </div>
  <span>
    {@html $microcopy?.footer?.site}
    <a href={repository}>
      <Icon inline icon="ri:open-source-fill" style="padding-right: 3pt;" />open source
    </a>
    {@html $microcopy?.footer?.uses}
    <Icon inline icon="bxs:cookie" />
    Cookies.
  </span>
  {#if $microcopy?.country == `de`}
    <Social {social} style="margin-top: 1ex;" />
  {/if}
</footer>

<style>
  footer {
    padding: 3em calc(1em + 3vw);
    text-align: center;
    display: grid;
    gap: 3em;
    place-items: center;
    background: var(--footer-bg);
    color: white;
  }
  footer :global(a) {
    color: var(--light-blue);
  }
  footer :global(a:hover) {
    color: var(--green);
  }
  footer div {
    margin: auto;
    display: flex;
    gap: 2em;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
