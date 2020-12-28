import { writable } from 'svelte/store'

export const colorModeKey = `colorMode`

export const colorMode = writable(`auto`)

colorMode.subscribe(
  (val) =>
    typeof localStorage !== `undefined` && (localStorage[colorModeKey] = val)
)

export const signupForm = writable(
  typeof localStorage !== `undefined` && localStorage.signupForm
    ? JSON.parse(localStorage.signupForm)
    : {}
)

signupForm.subscribe(
  (val) =>
    typeof localStorage !== `undefined` &&
    (localStorage.signupForm = JSON.stringify(val))
)
