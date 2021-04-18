<script>
  // This component uses the Google Maps Places API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import Map from './Map.svelte'

  export let placeholder = ``
  export let required = false
  export let name = ``
  export let input = undefined // input field whose value is read when submitting the form

  let enterInput // field that users interact with
  let map, infoWindowDiv, place

  function mountInput() {
    // autocomplete options
    const options = {
      componentRestrictions: { country: `de` },
      fields: [`formatted_address`, `geometry`, `name`],
      origin: map.getCenter(),
      strictBounds: false,
      types: [`geocode`],
    }

    const autocomplete = new window.google.maps.places.Autocomplete(enterInput, options)
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo(`bounds`, map)
    const infoWindow = new window.google.maps.InfoWindow()
    infoWindow.setContent(infoWindowDiv)

    const anchorPoint = new window.google.maps.Point(0, -29)
    const marker = new window.google.maps.Marker({ map, anchorPoint })

    autocomplete.addListener(`place_changed`, () => {
      infoWindow.close()
      marker.setVisible(false)
      place = autocomplete.getPlace()
      const lat = place.geometry?.location.lat()
      const lng = place.geometry?.location.lng()
      input.value = JSON.stringify({
        address: place.formatted_address,
        coords: { lat, lng },
      })

      if (!place.geometry?.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert(`Für '${place.name}' konnte keine Adresse gefunden werden!`)
        return
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry.viewport)
      } else {
        map.setCenter(place.geometry.location)
        map.setZoom(17)
      }
      marker.setPosition(place.geometry.location)
      marker.setVisible(true)

      infoWindowDiv.children[`place-name`].textContent = place.name
      infoWindowDiv.children[`place-address`].textContent = place.formatted_address
      infoWindow.open(map, marker)
    })
  }
</script>

<!-- for holding the component's value in a way accessible to the DOM -->
<input
  bind:this={input}
  {required}
  {name}
  id={name}
  on:focus={() => enterInput.focus()}
  class="hidden" />
<input bind:this={enterInput} type="text" {placeholder} {required} />

<Map
  bind:map
  onLoad={mountInput}
  mapDivCss="height: 300px; margin: 1em 0; border-radius: 3pt;" />

<div bind:this={infoWindowDiv}>
  <strong id="place-name" /><br />
  <span id="place-address" />
</div>

<style>
  input {
    background: var(--accentBg);
    width: 100%;
    text-overflow: ellipsis;
  }
  input.hidden {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    width: 1pt;
    padding: 1pt;
    /* needed to hide red shadow around required inputs in some browsers */
    box-shadow: none;
  }
  /* make autocomplete suggestions color-mode responsive */
  /* https://developers.google.com/maps/documentation/javascript/places-autocomplete#style-autocomplete */
  :global(.pac-container) {
    background: var(--bodyBg);
    border-radius: 3pt;
  }
  :global(.pac-item:hover) {
    background: var(--accentBg);
  }
  :global(.pac-item span) {
    color: var(--textColor);
  }
  /* hide google logo from autocomplete suggestions */
  :global(.pac-logo:after) {
    display: none;
  }
</style>
