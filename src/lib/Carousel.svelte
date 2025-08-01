<script>
    import { PostPreview } from '$lib'
    import { fetch_posts } from '$lib/fetch'

    // Package source: https://www.npmjs.com/package/svelte-carousel
    import Carousel from 'svelte-carousel';

    let carousel; // for calling methods of the carousel instance
        
    export let posts;
    export let autoplay = true
    export let autoplayDuration = 3000
    export let autoplayProgressVisible = true
    // TODO:CS: Style-Frage Dots ja/nein? Wenn ja nur ausgewaehlte Beitraege, da zu viele sonst?
    export let dots = false
    
    let error: Error | undefined = undefined
    
    async function get_posts() {
        try {
            posts = await fetch_posts()
        } catch (err) {
            error = err as Error
            console.error('Failed to fetch posts:', err)
        }
    }
</script>

{#await get_posts() then _}
    {#if !error && posts && posts.length > 0}
        <Carousel
            {autoplay}
            {autoplayDuration}
            {autoplayProgressVisible}
            {dots}
        >
            {#each posts as post}
                <div>
                    <PostPreview {post} />
                </div>
            {/each}
        </Carousel>
    {/if}
{/await}

<style>
    ul {
      list-style: none;
      max-width: 56em;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(18em, 1fr));
      grid-gap: 1em;
      margin: auto;
      padding: 2em 1em;
    }
  </style>
  