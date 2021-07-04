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
  export let maxZoom = 10
  export let map = undefined
  export let css = ``
  export let scrollZoom = false

  let mapDiv

  onMount(() => {
    map = new mapboxgl.Map({
      container: mapDiv,
      style: `mapbox://styles/mapbox/outdoors-v11?optimize=true`,
      center: [lng, lat],
      zoom,
      minZoom,
      maxZoom,
      scrollZoom,
    })

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
