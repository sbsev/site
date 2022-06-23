<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  // This is an automatic forward for a legacy url
  export const load: Load = ({ url }) => {
    const type = url.searchParams.get(`type`) === `Schüler` ? `pupil` : `student`
    return {
      status: 307,
      redirect: `/signup-${type}`,
    }
  }
</script>
