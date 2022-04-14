import { writable, readable } from 'svelte/store'
import type { SignupStore, Yaml } from './types'
import { fetchYaml } from './fetch'

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

export const microcopy = readable({}, (set) => {
  fetchYaml(`smallTexts`).then((data: Yaml) => set(data))
})
