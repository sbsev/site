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
    
    async function get_posts() {
        posts = await fetch_posts()
    }

    // Alternative carousel with beautiful animations: https://splidejs.com/integration/svelte-splide/
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';
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

    <!-- TODO:CS: Dauert etwas lange zu rendern... -->
    <!-- <Splide options={ { rewind: true } } aria-label="Svelte Splide Example"> -->
    <Splide options={{ 
        type: 'loop', 
        padding:'5rem',
        gap: '2rem', 
        autoplay: true
    }} aria-label="Svelte Splide Example">
        {#each posts as post}
            <SplideSlide>
                <PostPreview {post} />
            </SplideSlide>
        {/each}
    </Splide>
{/await}
