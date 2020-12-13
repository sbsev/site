<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'

  export let onLoad = () => {}
  export let mapProps = {}
  export let onLoadProps

  const { session } = stores()
  const { GOOGLE_MAPS_API_KEY: apiKey } = $session
  let div, map

  // insert some defaul map props
  mapProps = { center: { lat: 48, lng: 8 }, zoom: 5, ...mapProps }

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

  $: if (map && typeof onLoad === `function`) onLoad(map, onLoadProps)
</script>

<div bind:this={div} />

<style>
  div {
    height: 30em;
    max-height: 60vh;
  }
</style>
