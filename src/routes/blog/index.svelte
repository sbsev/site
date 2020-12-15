<script context="module">
  import { fetchPosts } from '../queries'

  export async function preload(_, session) {
    const posts = await fetchPosts(session.gqlUri)
    return { posts }
  }
</script>

<script>
  export let posts
</script>

<div>
  {#each posts as { title, slug, cover, date, author }}
    <section>
      <a href="/blog/{slug}"><img
          src={cover.url}
          alt={cover.description}
          loading="lazy" /></a>
      <h3><a href="/blog/{slug}">{title}</a></h3>
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
  img {
    width: 100%;
    border-radius: 4pt;
  }
</style>
