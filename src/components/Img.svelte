<script>
  export let src, alt
  export let width = undefined
  export let height = undefined
  export let base64 = ``
  export let title = ``
  export let pictureStyle = ``
  export let imgStyle = ``
  export let sizes = [{ w: 1500 }, { w: 1200 }, { w: 900 }, { w: 500 }, { w: 400 }]

  // heights are optional but widths are required for media=min-width below
  if (!sizes.every((s) => s.w)) throw `Img with src="${src}" size missing width`

  let [naturalWidth, naturalHeight] = [width, height]
  $: ({ w: width, h: height } = sizes.slice(-1)[0]) // grab the smallest width and height (if any)
  // compute natural height if custom height was not specified
  // (used to prevent layout shift by passing as <img {width} {height} />)
  $: if (!height) height = (width * naturalHeight) / naturalWidth

  const toQueryStr = (obj) =>
    Object.entries(obj)
      .map(([key, val]) => `${key}=${val}`)
      .join(`&`)

  $: style = `background-image: url('${base64}'); ${imgStyle}`
</script>

{#if src.endsWith(`.svg`)}
  <img {src} {alt} {title} {width} {height} style={imgStyle} />
{:else}
  <picture style={pictureStyle} class>
    {#each sizes as size, idx}
      <source
        media="(min-width: {idx + 1 === sizes.length ? 0 : size.w}px)"
        type="image/webp"
        srcset="{src}?{toQueryStr(size)}&q=80&fit=fill&fm=webp" />
    {/each}
    <img src="{src}?{toQueryStr(sizes[0])}&q=80" {alt} {width} {height} {title} {style} />
  </picture>
{/if}

<style>
  img {
    object-fit: cover;
    height: 100%;
    background: no-repeat center center;
    background-size: cover;
  }
</style>
