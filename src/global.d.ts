/// <reference types="@sveltejs/kit" />

declare module 'marked'
declare module 'svelte-range-slider-pips'

interface Window {
  plausible: (event: string, ...args: unknown[]) => void
  visitedPages: string[]
}
