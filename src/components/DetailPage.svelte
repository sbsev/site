<script>
  import VideoEmbed from './VideoEmbed.svelte'
  import { reduceMeta } from '../utils'
  export let item
  const { title, date, img, html, tag, collaborator, channel, videoId } = item
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div>
  <h1>{title}</h1>
  <p>{reduceMeta(date, channel, tag, collaborator && `Mit: ${collaborator}`)}</p>

  {#if videoId}
    <VideoEmbed {videoId} />
  {:else if img}<img src={img} alt={title} />{/if}
  {#if html}
    {@html html}
  {/if}
</div>

<style>
  div {
    max-width: 40em;
    margin: auto;
    display: grid;
    justify-items: center;
  }
  img {
    width: 100%;
    border-radius: 1ex;
  }
  p {
    background: var(--accentBg);
    border-radius: 1ex;
    padding: 1pt 1ex;
  }
</style>
