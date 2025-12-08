// Type declarations for svelte-toc to fix Svelte 5 compatibility
declare module 'svelte-toc' {
  import type { Component } from 'svelte'

  interface TocProps {
    title?: string
    openButtonLabel?: string
    headingSelector?: string
    '--toc-mobile-bg'?: string
    '--toc-min-width'?: string
    '--toc-font-size'?: string
    '--toc-desktop-sticky-top'?: string
    [key: string]: unknown
  }

  const Toc: Component<TocProps>
  export default Toc
}
