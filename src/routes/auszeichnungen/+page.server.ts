import { fetch_page, fetch_yaml_list } from "#lib/fetch.js";

export const load = async () => {
  return {
    page: await fetch_page(`auszeichnungen`),
    awards: await fetch_yaml_list(`Auszeichnungen`, `auszeichnungen#`),
  };
};
