<script lang="ts">
  type ImgSize = { w?: number; h?: number }

  interface Props {
    src: string
    alt: string
    width?: number
    height?: number
    base64?: string
    title?: string
    picture_style?: string
    img_style?: string
    loading?: `eager` | `lazy` | null | undefined
    sizes?: ImgSize[]
  }

  const defaultSizes: ImgSize[] = [
    { w: 1500 },
    { w: 1200 },
    { w: 900 },
    { w: 600 },
    { w: 400 },
  ]

  let {
    src,
    alt,
    width: propWidth = 100,
    height: propHeight = 100,
    base64 = ``,
    title = ``,
    picture_style = ``,
    img_style = ``,
    loading = `lazy`,
    sizes: propSizes,
  }: Props = $props()

  const sizes = $derived(propSizes ?? defaultSizes)

  // heights are optional but widths are required for media=min-width below
  const sizesValid = $derived(sizes.every((s) => s.w))
  $effect(() => {
    if (!sizesValid) throw `Img with src="${src}" size missing width`
  })

  // Calculate dimensions based on sizes prop or defaults
  const width = $derived(sizes[0]?.w ?? propWidth)
  const height = $derived(sizes[0]?.h ?? (propWidth === propHeight ? propWidth : propHeight))

  const toQueryStr = (size: ImgSize) =>
    new URLSearchParams(size as Record<string, string>).toString()

  // must be reactive to render changes to src and sizes
  const srcSet = $derived((params: string) =>
    sizes.map((size) => `${src}?${toQueryStr(size)}&${params} ${size.w}w`).join(`, `)
  )

  const style = $derived(base64 ? `background-image: url('${base64}');${img_style}` : img_style)
</script>

{#if src?.endsWith(`.svg`)}
  <img {src} {alt} {title} {width} {height} style={img_style} />
{:else}
  <picture style={picture_style}>
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
