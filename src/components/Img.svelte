<script>
  export let cover

  $: ({ small, medium, large, xl, jpg, description, title } = cover)
</script>

<picture>
  <source media="(min-width: 1600px)" type="image/webp" srcset={xl} />
  <source media="(min-width: 1200px)" type="image/webp" srcset={large} />
  <source media="(min-width: 800px)" type="image/webp" srcset={medium} />
  <source media="(min-width: 400px)" type="image/webp" srcset={small} />
  <img src={jpg} alt={description || title} />
</picture>

<style>
  picture img {
    width: 100%;
  }
</style>
