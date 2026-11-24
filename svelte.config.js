import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),

    prerender: {
      handleMissingId: `warn`,
      handleHttpError: ({ status, path, referrer, message }) => {
        const source = referrer ? ` (linked from ${referrer})` : ``;
        if (status === 404) {
          throw new Error(
            `Prerender could not find ${path}${source} (HTTP 404). Check that the page is published in Contentful and that the link matches its slug.`,
          );
        }
        throw new Error(`Prerender failed for ${path}${source} (HTTP ${status}). ${message}`);
      },
    },

    alias: {
      $root: `.`,
    },
  },
};
