import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    prerender: {
      handleMissingId: `warn`,
      handleHttpError: ({ status, path, referrer, message }) => {
        // Provide a clear, actionable error message for content editors
        const errorMsg = `
════════════════════════════════════════════════════════════════════
BUILD FAILED: Broken link detected!

  ❌ Page not found: ${path}
  📍 Linked from: ${referrer}

  This usually means a page in Contentful links to "${path}"
  but that page doesn't exist. Please check Contentful and either:
    1. Create the missing page at "${path}", or
    2. Remove/fix the link on the "${referrer}" page

════════════════════════════════════════════════════════════════════`
        throw new Error(errorMsg)
      },
    },

    alias: {
      $root: `.`,
    },
  },
}
