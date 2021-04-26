<script>
  // This component uses the Google Maps Places API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'

  export let selectHandler
  export let placeholder = ``
  export let required = false
  export let name = ``
  export let inputNode = undefined

  const { session } = stores()
  let autocomplete

  const autocompleteOptions = {
    componentRestrictions: { country: `de` },
    fields: [`formatted_address`, `geometry`, `name`],
    types: [`geocode`, `establishment`],
  }

  function mountInput() {
    autocomplete = new window.google.maps.places.Autocomplete(
      inputNode,
      autocompleteOptions
    )
    autocomplete.addListener(`place_changed`, () => {
      inputNode.value = ``
      inputNode.focus()
      selectHandler(autocomplete.getPlace())
    })
  }

  onMount(() => {
    let script = document.getElementById(`gm-js-api`)

    if (!script) {
      script = document.createElement(`script`) // dynamically created scripts are async by default
      script.src = `https://maps.googleapis.com/maps/api/js?key=${$session.GOOGLE_MAPS_API_KEY}&libraries=places`
      script.id = `gm-js-api`
      document.head.append(script)
    }
    if (!window.google?.maps) script.addEventListener(`load`, mountInput)
    else mountInput()

    return () => window.google.maps.event.clearInstanceListeners(autocomplete) // cleanup function, avoids mem leaks
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
  /* make autocomplete suggestions color-mode responsive */
  /* https://developers.google.com/maps/documentation/javascript/places-autocomplete#style-autocomplete */
  :global(.pac-container) {
    background: var(--accentBg);
    border-radius: 3pt;
  }
  :global(.pac-item:where(:hover, .pac-item-selected)) {
    background: var(--bodyBg);
  }
  :global(.pac-item span) {
    color: var(--textColor);
  }
  /* hide google logo from autocomplete suggestions */
  :global(.pac-logo::after) {
    display: none;
  }
</style>
