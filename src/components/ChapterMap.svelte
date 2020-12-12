<script>
  import { query } from 'svelte-apollo'
  import { gql } from '@apollo/client/core'
  import Map from '../components/Map.svelte'

  const getChapters = gql`
    {
      chapters: chapterCollection(where: { active: true }) {
        items {
          title
          slug
          coords {
            lat
            lng: lon
          }
        }
      }
    }
  `
  const pages = query(getChapters)

  const addMarkers = (map, { chapters }) => {
    chapters.forEach(({ title, slug, coords }, idx) => {
      const marker = new window.google.maps.Marker({
        map,
        position: coords,
        label: `${idx + 1}`,
        title,
      })
      marker.addListener(`click`, () => {
        window.location.href = slug
      })
    })
    map.fitBounds({ south: 49, west: 8, north: 54, east: 12 })
  }
</script>

<Map
  mapProps={{ disableDefaultUI: true }}
  onLoad={addMarkers}
  onLoadProps={{ chapters: $pages?.data?.chapters.items || [] }} />
