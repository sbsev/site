<script lang="ts">
  // This component uses the Mapbox JS API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import { session } from '$app/stores'
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { onMount } from 'svelte'

  // required yarn add -D events @types/events
  // https://github.com/mapbox/mapbox-gl-geocoder/issues/441

  export let selectHandler: (event: mapboxgl.EventData) => void
  export let placeholder = ``
  export let required = false
  export let name = ``

  onMount(() => {
    mapboxgl.accessToken = $session.MAPBOX_PUBLIC_KEY

    let geocoder = new MapboxGeocoder({
      accessToken: $session.MAPBOX_PUBLIC_KEY,
      countries: `de`,
      language: `de-DE`,
      types: `address,locality,neighborhood,poi`,
    })

    geocoder.addTo(`#geocoder`)

    geocoder.on(`result`, (event) => {
      geocoder.clear()
      selectHandler(event.result)
    })
  })
</script>

<!-- has to be <div/>, <input/> won't work -->
<div id="geocoder" {name} type="text" {placeholder} {required} />

<style>
  :global(.mapboxgl-ctrl-geocoder.mapboxgl-ctrl) {
    width: 100%;
    max-width: none;
    /* background: var(--accentBg);
    text-overflow: ellipsis;
    height: 2em;
    margin: 1ex 0; */
  }
</style>
