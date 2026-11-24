<script lang="ts">
  import type { Map as MapboxMap } from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { onMount } from "svelte";
  import { microcopy } from "../../stores";

  type MapMarker = {
    lng: number;
    lat: number;
    title: string;
    url?: string;
    classes?: string[];
  };

  interface Props {
    map?: MapboxMap | null;
    markers?: MapMarker[];
    css?: string;
    lng?: number;
    lat?: number;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
  }

  let {
    map = $bindable(null),
    markers = [],
    css = ``,
    lng: propLng,
    lat: propLat,
    zoom: propZoom,
    minZoom: propMinZoom,
    maxZoom: propMaxZoom,
  }: Props = $props();

  // Use props if provided, otherwise fall back to store, then defaults
  const getLocation = () => {
    const storeLoc = $microcopy?.map?.location;
    return {
      lng: propLng ?? storeLoc?.lng ?? 10,
      lat: propLat ?? storeLoc?.lat ?? 51.3,
      zoom: propZoom ?? storeLoc?.zoom ?? 5.05,
      minZoom: propMinZoom ?? storeLoc?.minZoom ?? 4,
      maxZoom: propMaxZoom ?? storeLoc?.maxZoom ?? 10,
    };
  };

  const { lng, lat, zoom, minZoom, maxZoom } = getLocation();

  let map_div: HTMLDivElement;

  onMount(() => {
    let mounted = true;
    let mapInstance: MapboxMap | undefined;

    async function mountMap() {
      const { default: mapboxgl } = await import(`mapbox-gl`);
      if (!mounted) return;

      const instance = new mapboxgl.Map({
        accessToken: import.meta.env.VITE_MAPBOX_PUBLIC_KEY,
        cooperativeGestures: true,
        container: map_div,
        style: `mapbox://styles/mapbox/outdoors-v11?optimize=true`,
        center: [lng, lat],
        zoom,
        minZoom,
        maxZoom,
      });
      map = mapInstance = instance;
      instance.on(`load`, () => instance.resize());

      // Sort north to south so southern markers have a higher stacking order.
      for (const { lng, lat, title, url, classes } of [...markers].sort((a, b) => b.lat - a.lat)) {
        const node = url
          ? Object.assign(document.createElement(`a`), { href: url })
          : document.createElement(`span`);
        node.innerHTML = title;
        if (classes?.length) node.classList.add(...classes);
        new mapboxgl.Marker(node, { anchor: `bottom`, offset: [0, -11] })
          .setLngLat([lng, lat])
          .addTo(instance);
      }
    }

    mountMap().catch((error) => console.error(`Could not load the map.`, error));
    return () => {
      mounted = false;
      mapInstance?.remove();
    };
  });
</script>

<div bind:this={map_div} style={css}></div>

<style>
  div {
    height: 700px;
    max-height: 75vh;
    min-height: 530px;
  }
  :global(.mapboxgl-ctrl-attrib-inner) {
    display: none;
  }
  :global(a.chapter) {
    color: white;
    font-size: 12pt;
    opacity: 0.9;
    border-radius: 4pt;
    padding: 0 3pt;
    line-height: 14pt;
  }
  :global(a.chapter.active) {
    background-color: var(--light-blue);
  }
  :global(a.chapter.starting) {
    background-color: var(--dark-green);
  }
  :global(a.chapter:hover) {
    background-color: var(--blue);
  }
  :global(a.chapter::after) {
    content: "";
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%);
    border: solid;
    border-width: 8pt 4pt;
    box-sizing: border-box;
  }
  :global(a.chapter.active::after) {
    border-color: var(--light-blue) transparent transparent transparent;
  }
  :global(a.chapter.starting::after) {
    border-color: var(--dark-green) transparent transparent transparent;
  }
</style>
