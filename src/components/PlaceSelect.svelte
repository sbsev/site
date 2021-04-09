<script>
  // This component uses the Google Maps Places API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import Map from './Map.svelte'
  import AutoCompletePlace from './AutoCompletePlace.svelte'
  import Delete from '@svicons/material-sharp/delete.svelte'

  export let placeholder = ``
  export let required = false
  export let name = ``
  export let input = undefined // hidden input field used to store value until it is read when submitting the form

  let places = []
  let markers = []
  let map, inputNode

  function selectHandler(place) {
    if (!place.geometry?.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the place details request failed.
      window.alert(`Für '${place.name}' konnte keine Adresse gefunden werden!`)
      return
    }

    const { lat, lng } = place.geometry?.location.toJSON()
    places = [...places, { address: place.formatted_address, coords: `${lat},${lng}` }]
    input.value = JSON.stringify(places)

    const marker = new window.google.maps.Marker({
      map,
      position: { lat, lng },
      label: { text: place.name.slice(0, 2), color: `white` },
      title: place.name,
    })
    markers.push(marker)

    const bounds = new window.google.maps.LatLngBounds()
    for (const marker of markers) {
      bounds.extend(marker.getPosition())
    }

    map.fitBounds(bounds)
  }
  const deletePlace = (idx) => () => {
    // remove place from list
    places.splice(idx, 1)
    places = places
    // remove marker from map
    markers[idx].setMap(null)
    markers.splice(idx, 1)
    // reset input value without removed place
    input.value = JSON.stringify(places)
  }
</script>

<!-- for holding the component's value in a way accessible to the DOM -->
<input
  bind:this={input}
  {required}
  {name}
  id={name}
  class="hidden"
  tabindex="-1"
  on:focus={() => inputNode.focus()} />
<!-- tabindex="-1" means skip element during tabbing, else we couldn't shift-tab out of filterInput as filterInput.focus() would jump right back -->

<AutoCompletePlace bind:inputNode {placeholder} {selectHandler} />
<ol>
  {#each places as place, idx}
    <li>
      <span>{idx + 1}</span><input
        data-place={idx + 1}
        type="text"
        value={place.address}
        disabled />
      <button on:click={deletePlace(idx)} type="button">
        <Delete style="width: 3ex; vertical-align: middle;" /></button>
    </li>
  {/each}
</ol>

<Map bind:map mapDivCss="height: 300px;" mapProps={{ maxZoom: 12 }} />

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
