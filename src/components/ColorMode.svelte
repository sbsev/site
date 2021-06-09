<script>
  import Modal from './Modal.svelte'
  import { colorMode, colorModeKey } from '../stores'
  import Sun from '@svicons/fa-solid/sun.svelte'
  import Moon from '@svicons/entypo/moon.svelte'
  import BrightnessAuto from '@svicons/material-sharp/brightness-auto.svelte'

  const colors = {
    blue: `#0b4abf`,
    darkBlue: `#003056`,
    darkerBlue: `#061725`,
    lightBlue: `#00a1ff`,
    lighterBlue: `#06c5ff`,

    green: `#89ba17`,
    darkGreen: `#4d8711`,
    darkerGreen: `#3c660f`,
    lightGreen: `#95d50f`,
    lighterGreen: `#caef76`,

    yellow: `#f9ff00`,
    darkYellow: `#ffca35`,
    lightYellow: `#fbff6c`,

    orange: `#e8ab00`,
    darkOrange: `#d88100`,
    lightOrange: `#ffca29`,

    gray: `#464849`,
    lightGray: `#d8d8d8`,
    lighterGray: `#efefef`,
    lightestGray: `#f6f6f6`,
    darkGray: `#2a2c30`,
  }

  const modeColors = {
    light: {
      textColor: `black`,
      linkColor: colors.blue,
      hoverColor: colors.lightBlue,
      bodyBg: colors.lightestGray,
      accentBg: `white`,
      lightBg: colors.lighterGray,
      shadow: colors.gray,
      borderColor: colors.lightBlue,
      headingColor: colors.lightBlue,
      headerBg: colors.darkBlue,
      headerColor: `white`,
      footerBg: colors.darkBlue,
      invert: 0,
      transparent: `rgba(255, 255, 255, 0.8)`,
    },
    dark: {
      textColor: `white`,
      linkColor: colors.lightBlue,
      hoverColor: colors.green,
      bodyBg: colors.darkerBlue,
      accentBg: `black`,
      lightBg: colors.darkGray,
      shadow: `black`,
      borderColor: colors.darkGreen,
      headingColor: colors.lightGreen,
      headerBg: colors.darkerBlue,
      headerColor: colors.lightBlue,
      footerBg: `black`,
      invert: 1,
      transparent: `rgba(0, 0, 0, 0.5)`,
    },
  }

  const setModeFactory = (mode) => () => {
    open = false
    $colorMode = mode
    applyColors()
  }

  function applyColors() {
    // If colorMode is `auto` we pick dark or light depending on prefersDark media query.
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches
    let activeMode
    if ($colorMode === `auto`) activeMode = prefersDark ? `dark` : `light`
    else activeMode = $colorMode

    // Define CSS vars for moded colors (both during SSR and in production).
    for (const [key, val] of Object.entries(modeColors[activeMode])) {
      if (val === undefined) console.error(`CSS variable ${key} is undefined`)
      document.body.style.setProperty(`--${key}`, val)
    }

    // Define CSS vars for non-moded colors as well while we're at it
    for (const [key, val] of Object.entries(colors)) {
      document.body.style.setProperty(`--${key}`, val)
    }
  }

  // boundFn and <svelte:head> below provide SSR support
  // we modify a stringified version of applyColors so it can run before hydration
  // and prevent color falshes on page load
  const boundFn = String(applyColors).replace(/\$colorMode/g, `colorMode`)

  /* eslint-disable no-useless-escape */
  const script = `
    <script>
      const colorMode = localStorage.${colorModeKey} || 'auto'
      const modeColors = ${JSON.stringify(modeColors)}
      const colors = ${JSON.stringify(colors)}
      window.addEventListener('DOMContentLoaded', ${boundFn})
    <\/script>`
  /* eslint-enable no-useless-escape */

  let open = false

  const handleKeydown = (event) => {
    if (!event.ctrlKey) return
    if (event.key === `1`) setModeFactory(`light`)()
    if (event.key === `2`) setModeFactory(`dark`)()
    if (event.key === `3`) setModeFactory(`auto`)()
  }
</script>

<svelte:head>
  {@html script}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<button class="opener" on:click={() => (open = true)} aria-label="Farbmodus öffnen">
  <Moon width="30px" style="vertical-align: text-bottom;" />
</button>

{#if open}
  <Modal on:close={() => (open = false)} style="width: max-content; max-width: 90vw;">
    <div>
      <button on:click={setModeFactory(`light`)} class="choice light">
        <Sun />
        Hell</button>
      <button on:click={setModeFactory(`dark`)} class="choice dark">
        <Moon color="yellow" />
        Dunkel</button>
      <button on:click={setModeFactory(`auto`)} class="choice auto">
        <BrightnessAuto color="var(--bodyBg)" />
        Auto</button>
    </div>
  </Modal>
{/if}

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
  }
  @media (max-width: 700px) {
    div {
      width: min-content;
    }
  }
  button.opener {
    padding: 0;
    grid-area: colormode;
    background: transparent;
    color: var(--yellow);
  }
  button.choice {
    height: 7ex;
    width: 10ex;
    display: grid;
    place-items: center;
    font-size: 3ex;
    box-shadow: 0 0 1em black;
    transition: 0.3s;
  }
  button.choice:hover {
    transform: scale(1.02);
  }
  button.choice.light {
    background: #f1f1f1;
    color: black;
  }
  button.choice.dark {
    background: #061725;
    color: white;
  }
  button.choice.auto {
    color: var(--textColor);
    background: linear-gradient(to right bottom, var(--textColor) 50%, var(--bodyBg) 50%);
  }
  button.choice :global(svg) {
    height: 3ex;
    padding-bottom: 12pt;
  }
</style>
