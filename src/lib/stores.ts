import { writable } from 'svelte/store'
import type { Microcopy, SignupStore } from './types'

const has_local_store = typeof localStorage !== `undefined`
const has_session_store = typeof sessionStorage !== `undefined`

export const colorModeKey = `color-mode`

type ColorMode = `light` | `dark` | `system`

// Initialize to 'system' for SSR, then hydrate from localStorage on client
export const colorMode = writable<ColorMode>(`system`)

// Flag to track if we've hydrated from localStorage
let colorModeHydrated = false

export function hydrateColorMode() {
  if (!colorModeHydrated && has_local_store) {
    const stored = localStorage[colorModeKey] as ColorMode | undefined
    if (stored) {
      colorMode.set(stored)
    }
    colorModeHydrated = true
  }
}

// Only persist to localStorage AFTER hydration (to avoid overwriting stored value)
colorMode.subscribe((val: ColorMode) => {
  if (colorModeHydrated && has_local_store) {
    localStorage[colorModeKey] = val
  }
})

// Custom session store implementation to replace svelte-zoo
function createSessionStore<T>(key: string, initialValue: T) {
  const store = writable<T>(
    has_session_store && sessionStorage[key]
      ? JSON.parse(sessionStorage[key])
      : initialValue,
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

export const microcopy = writable<Microcopy>({})
