<script lang="ts">
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { onMount } from 'svelte'
  import type { MapMarker } from '../types'
  import { microcopy } from '../stores'

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_KEY

  export let map: mapboxgl.Map | null = null
  export let markers: MapMarker[] = []
  export let lng = $microcopy?.map?.location?.lng ?? 10
  export let lat = $microcopy?.map?.location?.lat ?? 51.3
  export let zoom = $microcopy?.map?.location?.zoom ?? 5.05
  export let minZoom = $microcopy?.map?.location?.minZoom ?? 4
  export let maxZoom = $microcopy?.map?.location?.maxZoom ?? 10
  export let css = ``

  let mapDiv: HTMLDivElement

  // sort markers from north to south so southern makers have higher z-index
  $: markers = markers.sort((m1, m2) => m2.lat - m1.lat)

  onMount(() => {
    map = new mapboxgl.Map({
      cooperativeGestures: true,
      container: mapDiv,
      style: `mapbox://styles/mapbox/outdoors-v11?optimize=true`,
      center: [lng, lat],
      zoom,
      minZoom,
      maxZoom,
    })

    map.on(`load`, map.resize) // ensure map takes up full available width

    for (const { lng, lat, title, url, classes } of markers) {
      const anchor = document.createElement(`a`)
      anchor.innerHTML = title.slice(0, 4)
      anchor.href = url
      anchor.classList.add(...classes)

      const marker = new mapboxgl.Marker(anchor, { anchor: `bottom`, offset: [0, -11] })
      marker.setLngLat([lng, lat]).addTo(map)
    }
  })
</script>

<div bind:this={mapDiv} style={css} />

<style>
  div {
    height: 700px;
    max-height: 75vh;
    min-height: 530px;
  }
  :global(.mapboxgl-ctrl-attrib-inner) {
    display: none;
  }
</style>
