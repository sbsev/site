<script context="module">
  import { fetchPosts } from '../../utils/queries'

  export async function preload(_, session) {
    const posts = await fetchPosts(session.gqlUri)
    return { posts }
  }
</script>

<script>
  import Img from 'svelte-image'
  export let posts
</script>

<div>
  {#each posts as { title, slug, cover: { url, description, width, height }, date, author }}
    <section>
      <a href={slug}><Img
          src={url}
          alt={description}
          ratio={`${Math.floor((100 * height) / width)}%`} /></a>
      <h3><a href={slug}>{title}</a></h3>
      <span>{new Date(date).toLocaleDateString(`de`)}</span>
      <span>{author.name} {author.fieldOfStudy ? `(${author.fieldOfStudy})` : ``}</span>
    </section>
  {/each}
</div>

<style>
  div {
    max-width: 50em;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17em, 1fr));
    grid-gap: 2em 1.5em;
  }
  section {
    background: var(--accentBg);
    padding: 1ex;
    border-radius: 1ex;
  }
  div :global(.wrapper) {
    border-radius: 4pt;
    overflow: hidden;
  }
</style>
