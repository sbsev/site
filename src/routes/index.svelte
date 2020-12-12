<script>
  import { title } from './stores'
  import ChapterMap from '../components/ChapterMap.svelte'
</script>

<ChapterMap />
<div>
  <h1>{$title}</h1>
</div>

<style>
  div {
    max-width: 45em;
    margin: auto;
  }
</style>
