<script lang="ts">
  import { Img } from '.'
  import type { Post } from './types'

  interface Props {
    hit: Post
    onclose?: () => void
  }

  let { hit, onclose }: Props = $props()

  const { title, slug, body, cover, date, author } = $derived(hit)
</script>

<div>
  {#if cover?.src}
    <a href={slug} onclick={onclose}>
      <Img {...cover} sizes={[{ w: 150 }]} img_style="height: auto;" />
    </a>
  {/if}
  <h3>
    <a href={slug} onclick={onclose}>{@html title}</a>
  </h3>
  {#if date}<span>{new Date(date).toLocaleDateString(`de`)}</span>{/if}
  {#if author}<span>{author.name}</span>{/if}
  {#if body}
    <p>
      {@html body}
    </p>
  {/if}
</div>

<style>
  div {
    background: var(--accent-bg);
    padding: 1ex 1em;
    border-radius: 5pt;
    margin: 1em 0;
  }
  div > h3 {
    margin-top: 0;
  }
  div > p {
    margin-bottom: 0;
  }
  div :global(em) {
    color: var(--green);
  }
  div :global(picture) {
    float: right;
    border-radius: 2pt;
    margin: 1ex 0 1ex 1ex;
    overflow: hidden;
  }
</style>
