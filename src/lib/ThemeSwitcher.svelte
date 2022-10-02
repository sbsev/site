<script lang="ts">
  import Icon from '@iconify/svelte'
  import { colorMode } from './stores'

  // TODO: i18n the color mode titles
  const color_mode_icons = {
    light: [`ic:round-wb-sunny`, `system`],
    dark: [`octicon:moon-16`, `light`],
    system: [`bi:laptop`, `dark`],
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
  <Icon icon={color_mode_icons[$colorMode][0]} title={$colorMode} />
</button>
