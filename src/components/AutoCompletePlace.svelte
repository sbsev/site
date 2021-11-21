<script>
  // This component uses the Mapbox JS API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import { session } from '$app/stores'
  import { onMount } from 'svelte'

  export let selectHandler
  export let placeholder = ``
  export let required = false
  export let name = ``

  onMount(() => {
    window.mapboxgl.accessToken = $session.MAPBOX_PUBLIC_KEY

    let geocoder = new window.MapboxGeocoder({
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

<svelte:head>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css"
    rel="stylesheet"
  />
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
  <script
    src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css"
    type="text/css"
  />
</svelte:head>

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
