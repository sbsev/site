<script>
    import { PostPreview } from '$lib'
    import { fetch_posts } from '$lib/fetch'

    // Package source: https://www.npmjs.com/package/svelte-carousel
    // Alt with beautiful animations: https://splidejs.com/integration/svelte-splide/
    import Carousel from 'svelte-carousel';

    let carousel; // for calling methods of the carousel instance
        
    export let posts;
    export let autoplay = true
    export let autoplayDuration = 3000
    export let autoplayProgressVisible = true
    // TODO:CS: Style-Frage Dots ja/nein? Wenn ja nur ausgewaehlte Beitraege, da zu viele sonst?
    export let dots = false
    
    async function get_posts() {
        posts = await fetch_posts()
    }
</script>

{#await get_posts() then _ }
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
{/await}
