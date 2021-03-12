import { writable } from 'svelte/store'

const hasSessionStore = typeof sessionStorage !== `undefined`
const hasLocalStore = typeof localStorage !== `undefined`

export const colorModeKey = `colorMode`

export const colorMode = writable(
  (hasLocalStore && localStorage[colorModeKey]) ?? `auto`
)

colorMode.subscribe(
  (val) => hasLocalStore && (localStorage[colorModeKey] = val)
)

function createSessionStore(name, defaultValue) {
  const store = writable(
    hasSessionStore && sessionStorage[name]
      ? JSON.parse(sessionStorage[name])
      : defaultValue
  )

  store.subscribe(
    (val) => hasSessionStore && (sessionStorage[name] = JSON.stringify(val))
  )

  return store
}

export const studentSignupStore = createSessionStore(`studentSignup`, {})
export const pupilSignupStore = createSessionStore(`pupilSignup`, {})
