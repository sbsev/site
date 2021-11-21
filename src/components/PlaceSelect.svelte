<script>
  // This component uses the Google Maps Places API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import Delete from '@svicons/material-sharp/delete.svelte'
  import mapboxgl from 'mapbox-gl'
  import AutoCompletePlace from './AutoCompletePlace.svelte'
  import Map from './Map.svelte'

  export let placeholder = ``
  export let required = false
  export let name = ``
  export let input = undefined // hidden input field used to store value until it is read when submitting the form

  let places = []
  let markers = []
  let map

  function selectHandler(place) {
    if (!place.center) {
      // User entered the name of a place that was not suggested and
      // pressed the Enter key, or the place details request failed.
      window.alert(
        `Für '${place.text}' konnte keine Adresse gefunden werden! Bitte versuche einen anderen Ort anzugeben.`
      )
      return
    }

    const [lng, lat] = place.center

    places = [...places, { address: place.place_name, coords: `${lat},${lng}` }]
    input.value = JSON.stringify(places)

    const marker = new mapboxgl.Marker({ title: place.text })
    marker.setLngLat([lng, lat]).addTo(map)

    markers = [...markers, marker]

    const bounds = new mapboxgl.LngLatBounds(place.center, place.center)
    for (const marker of markers) {
      bounds.extend(marker._lngLat)
    }

    map.fitBounds(bounds, { padding: 100 })
  }
  const deletePlace = (idx) => () => {
    // remove place from list
    places.splice(idx, 1)
    places = places // reassign to trigger rerender
    // remove marker from map
    markers[idx].remove()

    markers.splice(idx, 1)
    // reset input value without removed place
    // set to null if places is empty since [] is truthy and would not prevent form submission if input is required
    input.value = JSON.stringify(places.length ? places : ``)
  }
</script>

<!-- for holding the component's value in a way accessible to the DOM -->
<!-- tabindex="-1" means skip element during tabbing, else we couldn't shift-tab out of filterInput as filterInput.focus() would jump right back -->
<input bind:this={input} {required} {name} id={name} class="hidden" tabindex="-1" />

<AutoCompletePlace {placeholder} {selectHandler} />
<ol>
  {#each places as place, idx}
    <li>
      <span>{idx + 1}</span><input
        data-place={idx + 1}
        type="text"
        value={place.address.split(`, `).slice(0, 2).join(`, `)}
        disabled
      />
      <button on:click={deletePlace(idx)} type="button">
        <Delete style="width: 3ex; vertical-align: middle;" />
      </button>
    </li>
  {/each}
</ol>

<Map bind:map {markers} css="height: 300px;" maxZoom={16} />

<style>
  ol {
    padding: 0;
  }
  ol li {
    margin: 1ex 0;
    display: flex;
    align-items: center;
  }
  ol li span {
    font-size: 2.5ex;
    padding: 2pt 6pt 2pt 2pt;
  }
  ol li span + input + button {
    color: var(--lightGray);
    transition: 0.3s;
  }
  ol li span + input + button:hover {
    color: var(--gray);
  }
  input {
    background: var(--accentBg);
    width: 100%;
    text-overflow: ellipsis;
    height: 2em;
  }
  input.hidden {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    width: 1px;
    /* needed to hide red shadow around required inputs in some browsers */
    box-shadow: none;
  }
</style>
