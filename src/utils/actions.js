export function onClickOutside(node, cb) {
  const detectClickOutside = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent(`clickOutside`, node))
      if (cb) cb()
    }
  }

  document.addEventListener(`click`, detectClickOutside)

  return {
    destroy: () => document.removeEventListener(`click`, detectClickOutside),
  }
}

export function preventOverScroll(node) {
  const preventScroll = (e) => {
    const scrollable =
      node.scrollWidth > node.clientWidth ||
      node.scrollHeight > node.clientHeight

    if (!scrollable) e.preventDefault()
  }

  node.addEventListener(`mousewheel`, preventScroll, { passive: false })
  return {
    onDestroy: () => node.removeEventListener(`mousewheel`, preventScroll),
  }
}
