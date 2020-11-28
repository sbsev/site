<script>
  import ActionButton from './ActionButton.svelte'
  import { colorMode, colorModeKey, modeColors } from '../stores'

  const setModeFactory = (mode) => () => {
    $colorMode = mode
    setColors()
  }

  const colorModes = [
    [`Hell`, `☀️`, setModeFactory(`light`)],
    [`Dunkel`, `🌙`, setModeFactory(`dark`)],
    [`Auto`, `⏱️`, setModeFactory(`auto`)],
  ]

  function setColors() {
    // 🎨
    // If colorMode is `auto` we pick dark or light depending on prefersDark media query.
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches
    const selectedColors =
      $colorMode === `auto` ? (prefersDark ? `dark` : `light`) : $colorMode

    for (const [key, val] of Object.entries(modeColors[selectedColors]))
      document.body.style.setProperty(`--${key}`, val) // Here we set the actual colors for the page after SSR.
  }
  // boundFn and the svelte:head script below provide SSR support
  const boundFn = String(setColors)
    .replace(
      `// 🎨`,
      `const [colorMode, modeColors]
      = [localStorage.${colorModeKey} ?? 'auto', ${JSON.stringify(modeColors)}]`
    )
    .replace(`$colorMode`, `colorMode`)

  // eslint-disable-next-line no-useless-escape
  const script = `<script>window.addEventListener('DOMContentLoaded', ${boundFn})<\/script>`
</script>

<ActionButton direction="down" options={colorModes} size="30" title="Color Mode" />

<svelte:head>
  {@html script}
</svelte:head>
