import { writable } from 'svelte/store'

export const colorModeKey = `colorMode`

export const colorMode = writable(`auto`)

colorMode.subscribe(
  (val) =>
    typeof localStorage !== `undefined` && (localStorage[colorModeKey] = val)
)

export const modeColors = {
  light: {
    textColor: `black`,
    linkColor: `darkblue`,
    bodyBg: `#f1f1f1`,
    accentBg: `white`,
    transparentBg: `rgba(255, 255, 255, 0.5)`,
    borderColor: `lightBlue`,
    shadowColor: `gray`,
    headingColor: `teal`,
  },
  dark: {
    textColor: `white`,
    linkColor: `#00a1ff`,
    bodyBg: `#061725`,
    accentBg: `#001d31`,
    transparentBg: `rgba(6, 23, 37, 0.5)`,
    borderColor: `orange`,
    shadowColor: `black`,
    headingColor: `orange`,
  },
}
