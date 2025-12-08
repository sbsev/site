<script lang="ts">
  import { colorMode } from './stores'
  import IconSunny from '~icons/ic/round-wb-sunny'
  import IconMoon from '~icons/octicon/moon-16'
  import IconLaptop from '~icons/bi/laptop'

  // TODO: i18n the color mode titles
  const color_mode_icons = {
    light: [IconSunny, `system`, `ic:round-wb-sunny`],
    dark: [IconMoon, `light`, `octicon:moon-16`],
    system: [IconLaptop, `dark`, `bi:laptop`],
  } as const

  function set_color_mode() {
    const next = color_mode_icons[$colorMode][1]
    // @ts-ignore
    $colorMode = next
  }
</script>

<button
  title="Set color mode"
  onclick={set_color_mode}
  style="display: flex; color: white;"
>
  <svelte:component this={color_mode_icons[$colorMode][0]} title={$colorMode} />
</button>
