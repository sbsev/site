<script>
  // This component uses the Google Maps Places API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import { onMount, onDestroy } from 'svelte'
  import { stores } from '@sapper/app'

  export let placeholder = ``
  export let required = false
  export let name = ``
  export let inputNode = undefined
  export let place = {}

  const { session } = stores()

  const autocompleteOptions = {
    componentRestrictions: { country: `de` },
    fields: [`formatted_address`, `geometry`, `name`],
    // origin: map.getCenter(),
    strictBounds: false,
    types: [`geocode`],
  }

  function mountInput() {
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputNode,
      autocompleteOptions
    )
    autocomplete.addListener(`place_changed`, () => {
      const completion = autocomplete.getPlace()
      if (!completion.geometry?.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the place details request failed.
        window.alert(`Für '${completion.name}' konnte keine Adresse gefunden werden!`)
        return
      }

      const lat = completion.geometry?.location.lat()
      const lng = completion.geometry?.location.lng()
      place = { address: completion.formatted_address, coords: [lat, lng] }
    })

    return () => window.google.maps.event.clearInstanceListeners(autocomplete)
  }

  onMount(() => {
    if (!window.google?.maps?.places) {
      const script = document.createElement(`script`)
      script.async = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${$session.GOOGLE_MAPS_API_KEY}&libraries=places`
      document.head.append(script)
      script.addEventListener(`load`, mountInput)
      return () => script.removeEventListener(`load`, mountInput)
    } else return mountInput()
  })

  onDestroy(() => {
    place = null
  })
</script>

<input bind:this={inputNode} {name} type="text" {placeholder} {required} />

<style>
  input {
    background: var(--accentBg);
    width: 100%;
    text-overflow: ellipsis;
    height: 2em;
    margin: 1ex 0;
  }
</style>
