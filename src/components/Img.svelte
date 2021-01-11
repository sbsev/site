<script>
  export let src, alt
  export let title = ``
  export let pictureStyle = ``
  export let imgStyle = ``
  export let sizes = [
    { width: 1600, height: 500 },
    { width: 1200, height: 400 },
    { width: 800, height: 350 },
    { width: 400, height: 300 },
  ]

  // equivalent GraphQL transformer to "{url}?fm=webp&q=80&w=400&h=300&fit=fill"
  // url(transform: {format: WEBP, quality: 80, width: 400, height: 300, resizeStrategy: FILL})
</script>

{#if src.endsWith(`.svg`)}
  <img {src} alt={alt || title} style={imgStyle} />
{:else}
  <picture style={pictureStyle}>
    {#each sizes as { width = ``, height = `` }, idx}
      <source
        media="(min-width: {idx + 1 === sizes.length ? 0 : width}px)"
        type="image/webp"
        srcset="{src}?w={width}&h={height}&q=80&fit=fill&fm=webp" />
    {/each}
    <img
      src="{src}?w={sizes[0].width}&h={sizes[0].height}&q=80"
      alt={alt || title}
      style={imgStyle} />
  </picture>
{/if}

<style>
  picture img {
    width: 100%;
    object-fit: cover;
  }
</style>
