export function onClickOutside(
  node: HTMLElement,
  cb?: () => void
): { destroy(): void } {
  const dispatchOnClickOutside = (event: Event) => {
    if (
      node &&
      !node.contains(event.target as Node) &&
      !event.defaultPrevented
    ) {
      node.dispatchEvent(new CustomEvent(`clickOutside`))
      if (cb) cb()
    }
  }

  document.addEventListener(`click`, dispatchOnClickOutside)

  return {
    destroy() {
      document.removeEventListener(`click`, dispatchOnClickOutside)
    },
  }
}

export function preventOverScroll(node: HTMLElement): { destroy(): void } {
  const preventScroll = (event: Event) => {
    const scrollable =
      node.scrollWidth > node.clientWidth ||
      node.scrollHeight > node.clientHeight

    if (!scrollable) event.preventDefault()
  }

  node.addEventListener(`mousewheel`, preventScroll, { passive: false })
  return {
    destroy: () => node.removeEventListener(`mousewheel`, preventScroll),
  }
}
