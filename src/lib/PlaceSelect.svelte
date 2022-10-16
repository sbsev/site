<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { Result } from '@mapbox/mapbox-gl-geocoder'
  import type { Map, Marker } from 'mapbox-gl'
  import mapbox from 'mapbox-gl'
  import Geocoder from './Geocoder.svelte'
  import MapComp from './Map.svelte'
  import type { Place } from './types'

  export let value: Place[] = [] // currently selected places
  export let placeholder = ``
  export let div: HTMLDivElement | null = null
  export let id: string | null = null

  let markers: Marker[] = []
  let map: Map

  function selectHandler(place: Result) {
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

    const marker = new mapbox.Marker()
    marker.setLngLat([lng, lat]).addTo(map)

    markers = [...markers, marker]

    const bounds = new mapbox.LngLatBounds([lng, lat], [lng, lat])
    for (const marker of markers) {
      bounds.extend(marker.getLngLat())
    }

    map.fitBounds(bounds, { padding: 100, duration: 400 })
  }

  const deletePlace = (idx: number) => () => {
    // remove place from list
    value.splice(idx, 1)
    value = value // reassign to trigger rerender
    // remove marker from map
    markers[idx].remove()

    markers.splice(idx, 1)
  }
</script>

<Geocoder {placeholder} {selectHandler} {id} bind:div />
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
        <Icon icon="ic:delete" style="width: 3ex;" inline />
      </button>
    </li>
  {/each}
</ol>

<MapComp bind:map css="height: 300px;" maxZoom={16} />

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
    color: var(--light-gray);
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
