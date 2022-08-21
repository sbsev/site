<script lang="ts">
  import Laptop from '~icons/bi/laptop'
  import Sun from '~icons/ic/round-wb-sunny'
  import Moon from '~icons/octicon/moon-16'
  import { colorMode } from './stores'

  // TODO: i18n the color mode titles
  const color_mode_icons = {
    light: [Sun, `system`],
    dark: [Moon, `light`],
    system: [Laptop, `dark`],
  } as const

  function set_color_mode() {
    const next = color_mode_icons[$colorMode][1]
    $colorMode = next
  }
</script>

<button
  title="Set color mode"
  on:click={set_color_mode}
  style="display: flex; color: white;"
>
  <svelte:component this={color_mode_icons[$colorMode][0]} width="1em" />
</button>
