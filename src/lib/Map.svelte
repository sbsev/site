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

  interface Props {
    map?: mapboxgl.Map | null
    markers?: MapMarker[]
    css?: string
    lng?: number
    lat?: number
    zoom?: number
    minZoom?: number
    maxZoom?: number
  }

  let {
    map = $bindable(null),
    markers = [],
    css = ``,
    lng: propLng,
    lat: propLat,
    zoom: propZoom,
    minZoom: propMinZoom,
    maxZoom: propMaxZoom,
  }: Props = $props()

  // Use props if provided, otherwise fall back to store, then defaults
  const getLocation = () => {
    const storeLoc = $microcopy?.map?.location
    return {
      lng: propLng ?? storeLoc?.lng ?? 10,
      lat: propLat ?? storeLoc?.lat ?? 51.3,
      zoom: propZoom ?? storeLoc?.zoom ?? 5.05,
      minZoom: propMinZoom ?? storeLoc?.minZoom ?? 4,
      maxZoom: propMaxZoom ?? storeLoc?.maxZoom ?? 10,
    }
  }

  const { lng, lat, zoom, minZoom, maxZoom } = getLocation()

  let map_div: HTMLDivElement

  // sort markers from north to south so southern makers have higher z-index
  $effect(() => {
    if (markers.length > 0) {
      markers = markers.sort((m1, m2) => m2.lat - m1.lat)
    }
  })

  onMount(() => {
    if (!map_div) return

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
      if (url) {
        const node = document.createElement(`a`)
        node.innerHTML = title
        node.href = url
        if (classes?.length) node.classList.add(...classes)
        const marker = new mapboxgl.Marker(node, { anchor: `bottom`, offset: [0, -11] })
        marker.setLngLat([lng, lat]).addTo(map)
      } else {
        const node = document.createElement(`span`)
        node.innerHTML = title
        if (classes?.length) node.classList.add(...classes)
        const marker = new mapboxgl.Marker(node, { anchor: `bottom`, offset: [0, -11] })
        marker.setLngLat([lng, lat]).addTo(map)
      }
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
