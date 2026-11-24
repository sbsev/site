import { microcopy } from "#lib/stores.js";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ data }) => {
  microcopy.set(data.smallTexts);
  return data;
};

export const prerender = true;
