import { writable } from 'svelte/store'
import type { SignupStore } from './types'

const hasSessionStore = typeof sessionStorage !== `undefined`
const hasLocalStore = typeof localStorage !== `undefined`

export const colorModeKey = `color-mode`

type ColorMode = `light` | `dark` | `system`

export const colorMode = writable<ColorMode>(
  (hasLocalStore && localStorage[colorModeKey]) || `system`
)

colorMode.subscribe(
  (val: ColorMode) => hasLocalStore && (localStorage[colorModeKey] = val)
)

function sessionStore<T>(name: string, initialValue: T) {
  if (hasSessionStore && localStorage[name]) {
    initialValue = JSON.parse(localStorage[name])
  }

  const { subscribe, set } = writable(initialValue)

  return {
    subscribe,
    set: (val: T) => {
      if (hasSessionStore) localStorage[name] = JSON.stringify(val)
      set(val)
    },
  }
}

export const signupStore = sessionStore<SignupStore>(
  `SignupStore`,
  {} as SignupStore
)

export const microcopy = writable({})
