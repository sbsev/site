import { writable } from 'svelte/store'
import type { SignupStore } from './types'

const has_local_store = typeof localStorage !== `undefined`
const has_session_store = typeof sessionStorage !== `undefined`

export const colorModeKey = `color-mode`

type ColorMode = `light` | `dark` | `system`

export const colorMode = writable<ColorMode>(
  (has_local_store && localStorage[colorModeKey]) || `system`,
)

colorMode.subscribe(
  (val: ColorMode) => has_local_store && (localStorage[colorModeKey] = val),
)

// Custom session store implementation to replace svelte-zoo
function createSessionStore<T>(key: string, initialValue: T) {
  const store = writable<T>(
    has_session_store && sessionStorage[key] 
      ? JSON.parse(sessionStorage[key]) 
      : initialValue
  )

  store.subscribe((val: T) => {
    if (has_session_store) {
      sessionStorage[key] = JSON.stringify(val)
    }
  })

  return store
}

export const signupStore = createSessionStore<SignupStore>(
  `SignupStore`,
  {} as SignupStore,
)

export const microcopy = writable<Record<string, any>>({})
