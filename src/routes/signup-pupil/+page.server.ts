import { loadSignupForm } from "#lib/server/signup-form.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, parent }) => {
  const { smallTexts } = await parent();
  return loadSignupForm(`pupil`, smallTexts.country, fetch);
};
