<script>
  import { goto, prefetch } from '@sapper/app'

  import Map from '../components/Map.svelte'

  export let chapters

  // chapters can be inside the addMarkers closure because it's static
  // if chapters might change and we wanted the markers to rerender,
  // it would need to be part of the map's props
  const addMarkers = (map) => {
    chapters.forEach(({ title, slug, coords, acceptsSignups }) => {
      const labelColor = acceptsSignups ? 'black' : 'white'
      const marker = new window.google.maps.Marker({
        map,
        position: coords,
        label: { text: title.slice(0, 2), color: labelColor },
        title,
      })
      marker.addListener(`mouseover`, () => prefetch(slug))
      marker.addListener(`click`, () => goto(slug))
    })
  }
  const mapProps = { disableDefaultUI: true }
</script>

<Map {mapProps} onLoad={addMarkers} />
