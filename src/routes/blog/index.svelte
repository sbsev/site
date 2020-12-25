<script context="module">
  import { fetchJson, fetchPosts, fetchTags } from '../../utils/queries'

  export async function preload(_, session) {
    const posts = await fetchPosts(session.gqlUri)
    const tags = await fetchTags(session.gqlUri)
    const social = await fetchJson(`Social`, session.gqlUri)
    return { posts, tags, social }
  }
</script>

<script>
  import PostPreview from '../../components/PostPreview.svelte'
  import Social from '../../components/Social.svelte'
  import TagList from '../../components/TagList.svelte'

  export let posts, tags, social

  tags.find((tag) => tag.title === `Alle`).total = posts.length

  let activeTag
  $: filteredPosts = posts.filter(
    (post) => activeTag === `Alle` || post.tags.includes(activeTag)
  )
</script>

<Social {social} fixed vertical />

<TagList {tags} bind:activeTag />

<ul>
  {#each filteredPosts as post (post.slug)}
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
</style>
