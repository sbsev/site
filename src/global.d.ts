/// <reference types="@sveltejs/kit" />

declare module 'marked'
declare module 'svelte-range-slider-pips'

interface Window {
  plausible: (event: string, ...args: unknown[]) => void
  visitedPages: string[]
}

declare module '*pupil.yml' {
  const form: import('./types').Form
  export default form
}

declare module '*student.yml' {
  const form: import('./types').Form
  export default form
}

declare module '*options.yml' {
  const options: import('./types').FormSelectOptions
  export default options
}

declare module '*messages.yml' {
  const messages: import('./types').FormMessages
  export default messages
}
