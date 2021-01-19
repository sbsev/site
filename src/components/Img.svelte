<script>
  export let src, alt
  export let width = undefined
  export let height = undefined
  export let base64 = ``
  export let title = ``
  export let pictureStyle = ``
  export let imgStyle = ``
  export let inline = false
  export let sizes = [
    { width: 1500, height: 500 },
    { width: 1200, height: 400 },
    { width: 900, height: 600 },
    { width: 500, height: 500 },
    { width: 400, height: 400 },
  ]

  let [naturalWidth, naturalHeight] = [width, height]
  $: ({ width, height } = sizes.slice(-1)[0]) // grab the smallest width and height (if any)
  $: if (!height) height = (width * naturalHeight) / naturalWidth

  // equivalent GraphQL transformer to "{url}?fm=webp&q=80&w=400&h=300&fit=fill"
  // url(transform: {format: WEBP, quality: 80, width: 400, height: 300, resizeStrategy: FILL})
</script>

{#if src.endsWith(`.svg`)}
  <img {src} {alt} {title} {width} {height} style={imgStyle} />
{:else}
  <picture style={pictureStyle} class:inline>
    {#if base64}
      <img src={base64} {alt} class="base64" {width} {height} />
    {/if}
    {#each sizes as { width = ``, height = `` }, idx}
      <source
        media="(min-width: {idx + 1 === sizes.length ? 0 : width}px)"
        type="image/webp"
        srcset="{src}?w={width}&h={height}&q=80&fit=fill&fm=webp" />
    {/each}
    <img
      src="{src}?w={sizes[0].width}&h={sizes[0].height}&q=80"
      {alt}
      {width}
      {height}
      {title}
      style={imgStyle} />
  </picture>
{/if}

<style>
  img {
    object-fit: cover;
    height: 100%;
  }
  picture {
    position: relative;
  }
  picture:not(.inline) {
    display: flex;
  }
  img.base64 {
    position: absolute;
    z-index: -1;
  }
</style>
