import { fetch_yaml_list } from "#lib/fetch.js";

export const load = async () => {
  return { faqs: await fetch_yaml_list(`FAQ`, `faq#`) };
};
