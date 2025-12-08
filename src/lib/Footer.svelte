<script lang="ts">
  import { repository } from '$root/package.json'
  import { Social } from '.'
  import { microcopy } from './stores'
  import type { Link } from './types'

  // Icon imports (bundled at build time)
  import IconLaw from '~icons/octicon/law'
  import IconPrivacy from '~icons/ic/round-privacy-tip'
  import IconEuro from '~icons/ic/round-euro'
  import IconDocument from '~icons/ion/document-text'
  import IconOpenSource from '~icons/ri/open-source-fill'
  import IconCookie from '~icons/bxs/cookie'

  const icon_map: Record<string, typeof IconLaw> = {
    Impressum: IconLaw,
    Datenschutz: IconPrivacy,
    Spenden: IconEuro,
    Satzung: IconDocument,
  }

  interface Props {
    links: Link[]
    social: Record<keyof typeof icon_map, string>
  }

  let { links, social }: Props = $props()
</script>

<footer>
  <img src="/favicon.svg" alt="ST Logo" height="60" />
  <span>© {new Date().getFullYear()} {$microcopy?.footer?.name}</span>
  <div>
    {#each links as { title, url }}
      <a href={url}>
        <svelte:component this={icon_map[title]} style="display: inline; vertical-align: -0.125em;" />
        {title}
      </a>
    {/each}
  </div>
  <span>
    {@html $microcopy?.footer?.site}
    <a href={repository}>
      <IconOpenSource style="display: inline; vertical-align: -0.125em; padding-right: 3pt;" />open source
    </a>
    {@html $microcopy?.footer?.uses}
    <IconCookie style="display: inline; vertical-align: -0.125em;" />
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
