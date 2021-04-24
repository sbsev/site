<script>
  import { stores } from '@sapper/app'
  import { onMount } from 'svelte'

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

  $: if (map && typeof onLoad === `function`) onLoad(map)

  onMount(() => {
    let script = document.getElementById(`gm-js-api`)

    if (!script) {
      script = document.createElement(`script`) // dynamically created scripts are async by default
      script.src = `https://maps.googleapis.com/maps/api/js?key=${$session.GOOGLE_MAPS_API_KEY}&libraries=places`
      script.id = `gm-js-api`
      document.head.append(script)
    }
    if (!window.google?.maps) script.addEventListener(`load`, mountMap)
    else mountMap()
  })
</script>

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
