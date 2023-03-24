<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import { Map } from '.'
  import { fetch_chapters } from './fetch'
  import { microcopy } from './stores'
  import type { Chapter } from './types'

  export const load: Load = () => {
    return { props: { chapters: fetch_chapters() } }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export const { lng, lat, zoom, minZoom, maxZoom } = $microcopy?.map?.location ?? {}
</script>

<div>
  <Map
    markers={chapters.map((chap) => ({
      ...chap.coords, // contains { lng, lat }
      classes: [`chapter`, chap.acceptsSignups ? `active` : chap.partnerAssociation? 'partner': `starting`],
      title: chap.token,
      url: chap.slug,
    }))}
    {lng}
    {lat}
    {zoom}
    {minZoom}
    {maxZoom}
  />

  <legend>
    <div>
      <span style="background: var(--light-blue)" />
      {$microcopy?.map?.text?.active}
    </div>
    <div>
      <span style="background: var(--dark-green)" />
      {$microcopy?.map?.text?.inSetup}
    </div>
    <div>
      <span style="background: var(--grey)" />
      {$microcopy?.map?.text?.partner}
    </div>
  </legend>
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
    border-radius: 50%;
    border: 1px dashed white;
    box-sizing: border-box;
    vertical-align: text-bottom;
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
  :global(a.chapter.partner) {
    background-color: var(--gray);
  }
  :global(a.chapter:hover) {
    background-color: var(--blue);
  }
  :global(a.chapter::after) {
    content: '';
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
  :global(a.chapter.partner::after) {
    border-color: var(--gray) transparent transparent transparent;
  }
</style>
