<script lang="ts">
  // import Icon from '@iconify/svelte'
  import IconDelete from '~icons/ic/delete'
  import type { Result } from '@mapbox/mapbox-gl-geocoder'
  import type { Map as MapBox, Marker } from 'mapbox-gl'
  import mapbox from 'mapbox-gl'
  import { Geocoder, Map } from '.'
  import type { Place } from './types'

  interface Props {
    value?: Place[]
    placeholder?: string
    div?: HTMLDivElement | null
    id?: string | null
  }

  let {
    value = $bindable([]),
    placeholder = ``,
    div = $bindable(null),
    id = null,
  }: Props = $props()

  let markers: Marker[] = []
  let map: MapBox | null = null // explicit null initialization

  function selectHandler(place: Result) {
    if (!place.center) {
      window.alert(
        `Für '${place.text}' konnte keine Adresse gefunden werden! Bitte versuche einen anderen Ort anzugeben.`
      )
      return
    }

    const [lng, lat] = place.center

    value = [...(value ?? []), { address: place.place_name, lng, lat }]

    if (map) {
      const marker = new mapbox.Marker()
      marker.setLngLat([lng, lat]).addTo(map)

      markers = [...markers, marker]

      const bounds = new mapbox.LngLatBounds([lng, lat], [lng, lat])
      for (const marker of markers) {
        bounds.extend(marker.getLngLat())
      }

      map.fitBounds(bounds, { padding: 100, duration: 400 })
    }
  }

  const deletePlace = (idx: number) => () => {
    if (!value) return
    // remove place from list
    value.splice(idx, 1)
    value = [...value]
    // remove marker from map
    if (markers[idx]) {
      markers[idx].remove()
      markers.splice(idx, 1)
    }
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
      <button onclick={deletePlace(idx)} type="button">
        <IconDelete style="width: 3ex; display: inline-block; vertical-align: -0.125em;" />
      </button>
    </li>
  {/each}
</ol>

<Map bind:map css="height: 300px;" maxZoom={16} />

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
    background: var(--accent-bg);
    width: 100%;
    text-overflow: ellipsis;
    height: 2em;
  }
</style>
