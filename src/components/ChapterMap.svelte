<script>
  import { goto, prefetch } from '@sapper/app'

  import Map from '../components/Map.svelte'

  export let chapters

  // chapters can be inside the addMarkers closure because it's static
  // if chapters might change and we wanted the markers to rerender,
  // it would need to be part of the map's props

  const addMarkers = (map) => {
    chapters.forEach(({ title, slug, coords, acceptsSignups }) => {
      const icon = {
        path: `m0 0h24v14h-24z m12 12-3-10h4.56z`, // needed to remove the default Google Maps marker as well as to make the correct map area behind the label clickable
        fillColor: `transparent`,
        strokeWeight: 0, // remove this to see the SVG path, helps position it correctly behind the labels
        anchor: new window.google.maps.Point(11, 30),
        labelOrigin: new window.google.maps.Point(10, 10),
      }

      const marker = new window.google.maps.Marker({
        map,
        icon,
        position: coords,
        label: {
          text: title.slice(0, 2),
          color: `white`,
          className: `chap ` + (acceptsSignups ? `old` : `new`),
        },
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
    ><span style="background: var(--darkGreen)" /> aktiver Standort&ensp;
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
    background: rgba(0, 0, 0, 0.7);
    padding: 2pt 4pt;
    border-radius: 3pt;
  }
  span {
    width: 2ex;
    height: 2ex;
    display: inline-block;
    border-radius: 5pt;
    box-shadow: 0 0 2pt;
    vertical-align: text-bottom;
  }
  :global(div.chap) {
    opacity: 0.9;
    padding: 0 2pt;
    border-radius: 1pt;
    position: relative;
  }
  :global(div.chap::after) {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%);
    border: solid;
    border-width: 10pt 4pt;
    box-sizing: border-box;
  }
  :global(div.chap.old::after) {
    border-color: var(--darkGreen) transparent transparent transparent;
  }
  :global(div.chap.new::after) {
    border-color: var(--blue) transparent transparent transparent;
  }
  :global(div.chap.old) {
    background: var(--darkGreen);
  }
  :global(div.chap.new) {
    background: var(--blue);
    border-color: var(--blue) transparent transparent transparent;
  }
</style>
