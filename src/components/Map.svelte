<script>
  import { onMount } from 'svelte'
  import { session } from '$app/stores'

  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'

  mapboxgl.accessToken = $session.MAPBOX_PUBLIC_KEY

  export let lng = 10
  export let lat = 51.5
  export let zoom = 5.2
  export let markers = []
  export let minZoom = 4
  export let maxZoom = 9

  let mapDiv, map

  onMount(() => {
    map = new mapboxgl.Map({
      container: mapDiv,
      style: `mapbox://styles/mapbox/outdoors-v11?optimize=true`,
      center: [lng, lat],
      zoom,
      minZoom,
      maxZoom,
    })

    for (const { lng, lat, title, url, color } of markers) {
      const anchor = document.createElement(`a`)
      anchor.innerHTML = title.slice(0, 4)
      anchor.href = url
      anchor.style.background = color
      new mapboxgl.Marker(anchor, { anchor: `bottom`, offset: [0, -11] })
        .setLngLat([lng, lat])
        .addTo(map)
    }
  })
</script>

<div bind:this={mapDiv} />

<style>
  div {
    height: 700px;
    max-height: 75vh;
    min-height: 530px;
  }
  :global(.mapboxgl-ctrl-attrib-inner) {
    display: none;
  }
  :global(a.mapboxgl-marker) {
    color: white;
    opacity: 0.9;
    border-radius: 4pt;
    padding: 0 3pt;
    line-height: 12pt;
  }
  :global(a.mapboxgl-marker::after) {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%);
    border: solid;
    border-width: 10pt 4pt;
    box-sizing: border-box;
  }
  :global(a.mapboxgl-marker::after) {
    border-color: rgba(255, 255, 255, 0.8) transparent transparent transparent;
  }
</style>
