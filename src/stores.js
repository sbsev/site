import { writable } from 'svelte/store'

export const colorModeKey = `colorMode`

export const colorMode = writable(`auto`)

colorMode.subscribe(
  (val) =>
    typeof localStorage !== `undefined` && (localStorage[colorModeKey] = val)
)
