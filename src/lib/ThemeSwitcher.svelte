<script lang="ts">
  import Icon from '@iconify/svelte'
  import { colorMode, microcopy } from './stores'

  // TODO: i18n the color mode titles
  const next_color_mode = {
    light: 'system',
    dark: 'light',
    system: 'dark',
  } as const

  const color_mode_icons = $microcopy?.icons?.global?.theme

  function set_color_mode() {
    const next = next_color_mode[$colorMode]
    $colorMode = next
  }
</script>

<button
  title="Set color mode"
  on:click={set_color_mode}
  style="display: flex; color: white;"
>
  <Icon icon={color_mode_icons[$colorMode]} title={$colorMode} />
</button>
