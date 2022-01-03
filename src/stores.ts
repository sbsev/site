import { writable } from 'svelte/store'
import type { SignupData } from './types'

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

function createSessionStore<T = unknown>(name: string, defaultValue: T) {
  const store = writable<T>(
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

export const signupStore = createSessionStore<SignupData>(
  `signupData`,
  {} as SignupData
)
