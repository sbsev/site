<script>
  export let src, alt
  export let width = undefined
  export let height = undefined
  export let base64 = ``
  export let title = ``
  export let pictureStyle = ``
  export let imgStyle = ``
  export let sizes = [{ w: 1500 }, { w: 1200 }, { w: 900 }, { w: 600 }, { w: 400 }]

  // heights are optional but widths are required for media=min-width below
  if (!sizes.every((s) => s.w)) throw `Img with src="${src}" missing width`

  let [naturalWidth, naturalHeight] = [width, height]
  $: ({ w: width, h: height } = sizes[0]) // grab first smallest width and height (if any)
  // to compute natural height if custom height was not specified
  // (used to prevent layout shift by passing as <img {width} {height} />)
  $: if (!height) height = (width * naturalHeight) / naturalWidth

  const toQueryStr = (obj) => new URLSearchParams(obj).toString()

  // must be reactive to render changes to src and sizes
  $: srcSet = (params) =>
    sizes.map((size) => `${src}?${toQueryStr(size)}&${params} ${size.w}w`).join(`, `)

  $: style = base64 ? `background-image: url('${base64}');${imgStyle}` : imgStyle
</script>

{#if src.endsWith(`.svg`)}
  <img {src} {alt} {title} {width} {height} style={imgStyle} />
{:else}
  <picture style={pictureStyle} class>
    <source srcset={srcSet(`q=80&fit=fill&fm=webp`)} type="image/webp" />
    <source srcset={srcSet(`q=80&fit=fill`)} />
    <img src="{src}?{toQueryStr(sizes[0])}&q=80" {alt} {width} {height} {title} {style} />
  </picture>
{/if}

<style>
  img {
    object-fit: cover;
    background: no-repeat center;
    background-size: cover;
  }
</style>
