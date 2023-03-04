<script lang="ts">
  import { BasePage } from '$lib'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<BasePage page={data.page} />
