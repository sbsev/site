import { writable } from 'svelte/store'

const hasSessionStore = typeof sessionStorage !== `undefined`
const hasLocalStore = typeof localStorage !== `undefined`

export const colorModeKey = `colorMode`

export const colorMode = writable<`light` | `dark` | `auto`>(
  (hasLocalStore && localStorage[colorModeKey]) || `auto`
)

colorMode.subscribe(
  (val: `light` | `dark` | `auto`) =>
    hasLocalStore && (localStorage[colorModeKey] = val)
)

function createSessionStore(name: string, defaultValue: unknown) {
  const store = writable<unknown>(
    hasSessionStore && sessionStorage[name]
      ? JSON.parse(sessionStorage[name])
      : defaultValue
  )

  if (hasSessionStore) {
    store.subscribe(
      (val: unknown) => (sessionStorage[name] = JSON.stringify(val))
    )
  }

  return store
}

export const studentSignupStore = createSessionStore(`studentSignup`, {})
export const pupilSignupStore = createSessionStore(`pupilSignup`, {})
