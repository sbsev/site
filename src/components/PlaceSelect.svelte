<script>
  // This component uses the Google Maps value API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import Delete from '@svicons/material-sharp/delete.svelte'
  import mapboxgl from 'mapbox-gl'
  import AutoCompletePlace from './AutoCompletePlace.svelte'
  import Map from './Map.svelte'

  export let value = [] // currently selected places
  export let placeholder = ``

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

    value = [...(value ?? []), { address: place.place_name, lng, lat }]

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
    value.splice(idx, 1)
    value = value // reassign to trigger rerender
    // remove marker from map
    markers[idx].remove()

    markers.splice(idx, 1)
  }
</script>

<AutoCompletePlace {placeholder} {selectHandler} />
<ol>
  {#each value ?? [] as place, idx}
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
</style>
