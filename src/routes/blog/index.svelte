<script context="module">
  import { fetchPosts } from '../../utils/queries'

  export async function preload(_, session) {
    const posts = await fetchPosts(session.gqlUri)
    return { posts }
  }
</script>

<script>
  import PostPreview from '../../components/PostPreview.svelte'

  export let posts
</script>

<ul>
  {#each posts as post}
    <PostPreview {post} />
  {/each}
</ul>

<style>
  ul {
    max-width: 50em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16em, 1fr));
    grid-gap: 1em;
    margin: auto;
    padding: 2em 1em;
  }
</style>
