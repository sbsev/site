<script context="module">
  import { fetchPosts, fetchTags } from '../../utils/queries'

  export async function preload(_, session) {
    const posts = await fetchPosts(session.gqlUri)
    const tags = await fetchTags(session.gqlUri)
    return { posts, tags }
  }
</script>

<script>
  import Tags from '@svg-icons/fa-solid/tags.svg'

  import PostPreview from '../../components/PostPreview.svelte'

  export let posts, tags

  let activeTag = `Alle`
  $: filteredPosts = posts.filter(
    (post) => activeTag === `Alle` || post.tags.includes(activeTag)
  )
</script>

<h2>
  <Tags height="20" />Tags
</h2>
<ul>
  {#each tags as { title, total, icon }}
    <button on:click={() => (activeTag = title)}>
      <img src={icon.url} alt={title} />
      {title}
      ({total})</button>
  {/each}
</ul>

<ul>
  {#each filteredPosts as post}
    <PostPreview {post} />
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    max-width: 50em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16em, 1fr));
    grid-gap: 1em;
    margin: auto;
    padding: 2em 1em;
  }
  h2 {
    text-align: center;
    margin-top: 2em;
  }
  h2 + ul {
    padding: 0 1em 2em;
    max-width: 40em;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
  }
  ul > button {
    border: 1px dotted;
    padding: 3pt 7pt;
  }
  ul > button > img {
    height: 20px;
    background: var(--green);
    padding: 2pt;
    border-radius: 1ex;
    vertical-align: bottom;
    margin-right: 4pt;
  }
</style>
