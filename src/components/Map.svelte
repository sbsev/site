<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'

  export let onLoad = () => {}
  export let mapProps = {}

  const { session } = stores()
  let div, map
  const mapId = `2c1732cc2265001f` // enables vector maps

  // default map props
  mapProps = { center: { lat: 51.16, lng: 10.45 }, zoom: 6, mapId, ...mapProps }

  const mountMap = () => (map = new window.google.maps.Map(div, mapProps))

  onMount(() => {
    if (!window.google) {
      const script = document.createElement(`script`)
      script.async = true
      script.src = `https://maps.googleapis.com/maps/api/js?v=beta&key=${$session.GOOGLE_MAPS_API_KEY}&map_ids=${mapId}`
      document.head.append(script)
      script.addEventListener(`load`, mountMap)
      return () => script.removeEventListener(`load`, mountMap)
    } else mountMap()
  })

  $: if (map && typeof onLoad === `function`) onLoad(map)
</script>

<div bind:this={div} />

<style>
  div {
    height: 30em;
    max-height: 60vh;
  }
</style>
