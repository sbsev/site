<script>
    import { browser } from '$app/environment';
    import { PostPreview } from '$lib'
    import { fetch_posts } from '$lib/fetch'

    import Carousel from 'svelte-carousel';
    // Alt no package: https://svelte.dev/repl/a363db348ba4485d965c5b5464428a73?version=3.31.2
    // Alt with beautiful animations: https://splidejs.com/integration/svelte-splide/

    let carousel; // for calling methods of the carousel instance
        
    export let posts;
    
    async function get_posts() {
        posts = await fetch_posts()
    }
</script>

{#await get_posts() then _ }
    <Carousel
    autoplay
    autoplayDuration={5000}
    autoplayProgressVisible
    >
    {#each posts as post}
        <div>
            <PostPreview {post} />
        </div>
    {/each}
    </Carousel>
{/await}
