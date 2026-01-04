<script lang="ts">
  import { onMount } from 'svelte'
  import { colorMode, hydrateColorMode } from '../../stores'
  import IconSunny from '~icons/ic/round-wb-sunny'
  import IconMoon from '~icons/octicon/moon-16'
  import IconLaptop from '~icons/bi/laptop'

  // TODO: i18n the color mode titles
  const color_mode_icons = {
    light: [IconSunny, `system`, `ic:round-wb-sunny`],
    dark: [IconMoon, `light`, `octicon:moon-16`],
    system: [IconLaptop, `dark`, `bi:laptop`],
  } as const

  let hydrated = $state(false)

  function set_color_mode() {
    const next = color_mode_icons[$colorMode][1] as typeof $colorMode
    $colorMode = next
  }

  const CurrentIcon = $derived(color_mode_icons[$colorMode][0])

  onMount(() => {
    hydrateColorMode()
    hydrated = true
  })
</script>

<button
  title="Set color mode"
  onclick={set_color_mode}
  style="display: flex; color: white; opacity: {hydrated ? 1 : 0}; transition: opacity 0.15s;"
>
  <CurrentIcon title={$colorMode} />
</button>
