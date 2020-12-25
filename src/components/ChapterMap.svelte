<script>
  import Map from '../components/Map.svelte'

  export let chapters

  // chapters can be inside the addMarkers closure because it's static
  // if chapters might change and we wanted the markers to rerender,
  // it would need to be part of the map's props
  const addMarkers = (map) => {
    chapters.forEach(({ title, slug, coords }) => {
      const marker = new window.google.maps.Marker({
        map,
        position: coords,
        label: title.slice(0, 2),
        title,
      })
      marker.addListener(`click`, () => {
        window.location.href = slug
      })
    })
    map.fitBounds({ south: 49, west: 8, north: 54, east: 12 })
  }
  const mapProps = { disableDefaultUI: true }
</script>

<Map {mapProps} onLoad={addMarkers} />
