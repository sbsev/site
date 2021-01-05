import { writable } from 'svelte/store'

export const colorModeKey = `colorMode`

export const colorMode = writable(`auto`)

colorMode.subscribe(
  (val) =>
    typeof localStorage !== `undefined` && (localStorage[colorModeKey] = val)
)

function createSessionStore(name, defaultValue) {
  const store = writable(
    typeof sessionStorage !== `undefined` && sessionStorage[name]
      ? JSON.parse(sessionStorage[name])
      : defaultValue
  )

  store.subscribe(
    (val) =>
      typeof sessionStorage !== `undefined` &&
      (sessionStorage[name] = JSON.stringify(val))
  )

  return store
}

export const studentSignupStore = createSessionStore(`studentSignup`, {})
export const pupilSignupStore = createSessionStore(`pupilSignup`, {})
