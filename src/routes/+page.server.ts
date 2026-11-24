import { fetch_chapters, fetch_page } from "#lib/fetch.js";

export const load = async ({ fetch }) => {
  const page = await fetch_page(`/`, fetch);
  const chapters = await fetch_chapters(fetch);

  return {
    page,
    chapters,
  };
};
