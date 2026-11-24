import yaml from "@rollup/plugin-yaml";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      preprocess: vitePreprocess(),
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
    }),
    yaml(),
    Icons({
      compiler: "svelte",
      // Match @iconify/svelte default sizing (1em = text size)
      scale: 1,
    }),
  ],

  server: {
    port: 3000,
    fs: {
      allow: [`..`],
    },
  },

  preview: {
    port: 3000,
  },

  ssr: {
    // Keep Kit's cookie dependency in the server bundle so cached installs cannot shadow it.
    noExternal: ["cookie"],
  },

  fmt: {
    svelte: true,
    ignorePatterns: [`src/signup-form/**`],
  },

  lint: {
    ignorePatterns: [`**/*.svelte`, `build/**`, `.svelte-kit/**`, `scripts/**`],
    rules: {
      "no-unused-vars": [`error`, { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` }],
    },
  },
});
