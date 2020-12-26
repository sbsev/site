<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'

  export let onLoad = () => {}
  export let mapProps = {}

  const { session } = stores()
  const { GOOGLE_MAPS_API_KEY: apiKey } = $session
  let div, map

  // some default map props
  mapProps = { center: { lat: 51.16, lng: 10.45 }, zoom: 6, ...mapProps }

  onMount(() => {
    const mountMap = () => (map = new window.google.maps.Map(div, mapProps))

    if (!window.google) {
      const script = document.createElement(`script`)
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
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
