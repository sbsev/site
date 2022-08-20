<script lang="ts">
  export let src: string, alt: string
  export let width = 100
  export let height = 100
  export let base64 = ``
  export let title = ``
  export let pictureStyle = ``
  export let imgStyle = ``
  export let loading = `lazy`
  export let sizes: ImgSize[] = [
    { w: 1500 },
    { w: 1200 },
    { w: 900 },
    { w: 600 },
    { w: 400 },
  ]

  type ImgSize = { w?: number; h?: number }

  // heights are optional but widths are required for media=min-width below
  if (!sizes.every((s) => s.w)) throw `Img with src="${src}" size missing width`

  let [naturalWidth, naturalHeight] = [width, height] // copy user-provided width and height values

  // grab the first width and height (if any) to compute natural height if custom height was
  // not specified (used to prevent on-load layout shift by passing <img {width} {height} />)
  $: if (sizes[0]?.w) width = sizes[0].w
  $: if (sizes[0]?.h) height = sizes[0].h
  $: if (!height) height = (width * naturalHeight) / naturalWidth

  const toQueryStr = (size: ImgSize) =>
    new URLSearchParams(size as Record<string, string>).toString()

  // must be reactive to render changes to src and sizes
  $: srcSet = (params: string) =>
    sizes.map((size) => `${src}?${toQueryStr(size)}&${params} ${size.w}w`).join(`, `)

  $: style = base64 ? `background-image: url('${base64}');${imgStyle}` : imgStyle
</script>

{#if src.endsWith(`.svg`)}
  <img {src} {alt} {title} {width} {height} style={imgStyle} />
{:else}
  <picture style={pictureStyle}>
    <source srcset={srcSet(`q=80&fit=fill&fm=webp`)} type="image/webp" />
    <source srcset={srcSet(`q=80&fit=fill`)} />
    <img
      src="{src}?{toQueryStr(sizes[0])}&q=80"
      {alt}
      {width}
      {height}
      {title}
      {style}
      {loading}
    />
  </picture>
{/if}

<style>
  img {
    object-fit: cover;
    background: no-repeat center;
    background-size: cover;
  }
</style>
