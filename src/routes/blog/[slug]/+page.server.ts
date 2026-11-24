import { fetch_post, fetch_post_slugs } from "#lib/fetch.js";
import { error } from "@sveltejs/kit";
import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = async () => {
  const slugs = await fetch_post_slugs();
  return slugs.map((slug) => ({ slug }));
};

export const load = async ({ params }) => {
  const post = await fetch_post(params.slug);

  if (!post) error(404);

  return { post };
};
