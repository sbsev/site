<script lang="ts">
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { onMount } from 'svelte'
  import { microcopy } from './stores'

  type MapMarker = {
    lng: number
    lat: number
    title: string
    url?: string
    classes?: string[]
  }

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_KEY

  let {
    map = null,
    markers = [],
    css = ``,
  } = $props<{
    map?: mapboxgl.Map | null
    markers?: MapMarker[]
    css?: string
  }>()

  const { lng, lat, zoom, minZoom, maxZoom } = $microcopy?.map?.location ?? [
    10, 51.3, 5.05, 4, 10,
  ]

  let map_div: HTMLDivElement

  // sort markers from north to south so southern makers have higher z-index
  $effect(() => {
    if (markers.length > 0) {
      markers = markers.sort((m1, m2) => m2.lat - m1.lat)
    }
  })

  onMount(() => {
    map = new mapboxgl.Map({
      cooperativeGestures: true,
      container: map_div,
      style: `mapbox://styles/mapbox/outdoors-v11?optimize=true`,
      center: [lng, lat],
      zoom,
      minZoom,
      maxZoom,
    })

    map.on(`load`, map.resize) // ensure map takes up full available width

    for (const { lng, lat, title, url, classes } of markers) {
      const node = document.createElement(url ? `a` : `span`)
      node.innerHTML = title
      if (url) node.href = url
      if (classes?.length) node.classList.add(...classes)

      const marker = new mapboxgl.Marker(node, { anchor: `bottom`, offset: [0, -11] })
      marker.setLngLat([lng, lat]).addTo(map)
    }
  })
</script>

<div bind:this={map_div} style={css}></div>

<style>
  div {
    height: 700px;
    max-height: 75vh;
    min-height: 530px;
  }
  :global(.mapboxgl-ctrl-attrib-inner) {
    display: none;
  }
  :global(a.chapter) {
    color: white;
    font-size: 12pt;
    opacity: 0.9;
    border-radius: 4pt;
    padding: 0 3pt;
    line-height: 14pt;
  }
  :global(a.chapter.active) {
    background-color: var(--light-blue);
  }
  :global(a.chapter.starting) {
    background-color: var(--dark-green);
  }
  :global(a.chapter:hover) {
    background-color: var(--blue);
  }
  :global(a.chapter::after) {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%);
    border: solid;
    border-width: 8pt 4pt;
    box-sizing: border-box;
  }
  :global(a.chapter.active::after) {
    border-color: var(--light-blue) transparent transparent transparent;
  }
  :global(a.chapter.starting::after) {
    border-color: var(--dark-green) transparent transparent transparent;
  }
</style>
