<script>
  import { goto, prefetch } from '@sapper/app'
  import { colors } from '../colors'

  import Map from '../components/Map.svelte'

  export let chapters

  // chapters can be inside the addMarkers closure because it's static
  // if chapters might change and we wanted the markers to rerender,
  // it would need to be part of the map's props

  const addMarkers = (map) => {
    chapters.forEach(({ title, slug, coords, acceptsSignups }) => {
      const icon = {
        path: `M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0`,
        fillColor: acceptsSignups ? colors.darkGreen : colors.blue,
        fillOpacity: 0.8,
        strokeWeight: 0,
        scale: 0.8,
        anchor: new window.google.maps.Point(0, 5),
      }

      const marker = new window.google.maps.Marker({
        map,
        icon,
        position: coords,
        label: { text: title.slice(0, 2), color: `white` },
        title,
      })

      marker.addListener(`mouseover`, () => prefetch(slug))
      marker.addListener(`click`, () => goto(slug))
    })
  }
  const mapProps = { disableDefaultUI: true }
</script>

<div>
  <Map {mapProps} onLoad={addMarkers} />
  <legend
    ><span style="background: var(--darkGreen)" /> aktiver Standort &ensp;
    <span style="background: var(--blue)" /> in Gründung</legend>
</div>

<style>
  div {
    position: relative;
  }
  legend {
    position: absolute;
    right: 1ex;
    bottom: 1ex;
    color: white;
    background: rgba(0, 0, 0, 0.6);
    padding: 0 4pt 2pt;
    border-radius: 3pt;
  }
  span {
    width: 2.3ex;
    height: 2.3ex;
    display: inline-block;
    border-radius: 50%;
    opacity: 0.8;
    box-shadow: 0 0 1pt;
    vertical-align: middle;
  }
</style>
