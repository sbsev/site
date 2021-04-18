<script>
  import { stores } from '@sapper/app'

  export let map = undefined
  export let onLoad = () => {}
  export let mapDiv = undefined
  export let mapProps = {}
  export let mapDivCss = `height: 700px; max-height: 75vh; min-height: 530px;`

  const { session } = stores()

  // default map props
  mapProps = {
    center: { lat: 51.5, lng: 10 },
    zoom: 6,
    disableDefaultUI: true,
    ...mapProps,
  }

  const mountMap = () => (map = new window.google.maps.Map(mapDiv, mapProps))

  // This includes the places library to avoid needing to reimport Google Maps in
  // AutoCompletePlace.svelte which would warn "You have included the Google Maps
  // JavaScript API multiple times on this page. This may cause unexpected errors."
  const src = `https://maps.googleapis.com/maps/api/js?key=${$session.GOOGLE_MAPS_API_KEY}&libraries=places`

  $: if (map && typeof onLoad === `function`) onLoad(map)
</script>

<svelte:head>
  {#if typeof window !== `undefined` && !window.google}
    <script async {src} on:load={mountMap}></script>
  {/if}
</svelte:head>

<div bind:this={mapDiv} style={mapDivCss} />

<style>
  div {
    height: 700px;
    max-height: 75vh;
    min-height: 530px;
  }
  /* hide footer https://stackoverflow.com/a/22581969 */
  :global(.gm-style-cc) {
    display: none;
  }
</style>
