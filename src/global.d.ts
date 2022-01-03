/// <reference types="@sveltejs/kit" />

declare module 'marked'

interface Window {
  plausible: (event: string, ...args: unknown[]) => void
  visitedPages: string[]
}
