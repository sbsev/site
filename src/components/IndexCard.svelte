<script>
  import { reduceMeta } from '../utils'

  export let item

  const { title, slug, date, img, channel, tag, excerpt } = item
</script>

<div class="item">
  {#if img}<a href={slug}><img src={img} alt={title} loading="lazy" /></a>{/if}
  <a href={slug}><h2>{title}</h2></a>
  <p>{reduceMeta(date, channel, tag)}</p>
  {#if excerpt}
    <p class="excerpt">
      {@html excerpt}
    </p>
  {/if}
</div>

<style>
  div {
    background: var(--accentBg);
    padding: 5px;
    padding-bottom: 1ex;
    border-radius: 1ex;
    display: grid;
    height: max-content;
  }
  div > :not(:first-child) {
    margin: 0 0.5em;
  }
  div a h2 {
    font-size: 1.2em;
    font-weight: normal;
  }
  p.excerpt {
    padding-top: 1em;
  }
  img {
    width: 100%;
    border-radius: 4px;
  }
</style>
