import { session_store } from 'svelte-zoo/stores'
import { writable } from 'svelte/store'
import type { SignupStore } from './types'

const has_local_store = typeof localStorage !== `undefined`

export const colorModeKey = `color-mode`

type ColorMode = `light` | `dark` | `system`

export const colorMode = writable<ColorMode>(
  (has_local_store && localStorage[colorModeKey]) || `system`,
)

colorMode.subscribe(
  (val: ColorMode) => has_local_store && (localStorage[colorModeKey] = val),
)

export const signupStore = session_store<SignupStore>(
  `SignupStore`,
  {} as SignupStore,
)

export const microcopy = writable({})
