import { fetch_chapters, fetch_page } from "#lib/fetch.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const entries = async () =>
  (await fetch_chapters()).map(({ slug }) => ({ slug: slug.replace(/^\/standorte\//, ``) }));

export const load: PageServerLoad = async ({ params, parent, fetch }) => {
  const { slug } = params;
  const path = `standorte/${slug}`;
  const [page, { smallTexts, signupChapterSlugs }] = await Promise.all([
    fetch_page(path, fetch),
    parent(),
  ]);

  if (!page) error(404);

  const location = smallTexts.location;
  const overrides = page.yaml?.contactEmails;
  if (
    overrides !== undefined &&
    (!overrides ||
      typeof overrides !== `object` ||
      Array.isArray(overrides) ||
      overrides instanceof Date)
  ) {
    throw new Error(`Contentful page ${path}: contactEmails must be a YAML mapping.`);
  }

  const contactTypes = [`student`, `pupil`, `info`] as const;
  const contactEmails = contactTypes.map((kind) => {
    const override = overrides?.[kind];
    if (
      override !== undefined &&
      (typeof override !== `string` || !/^[^\s@?&#<>]+@[^\s@?&#<>]+$/.test(override))
    ) {
      throw new Error(
        `Contentful page ${path}: contactEmails.${kind} must contain an email address.`,
      );
    }
    const prefix = location?.[kind];
    const address =
      override ?? (prefix && location?.url ? `${prefix}.${slug}@${location.url}` : null);
    return { kind, address };
  });
  const managementEmail = contactEmails.find(({ kind }) => kind === `info`)?.address;
  const subjectStart = location?.mailTo?.indexOf(`?`) ?? -1;
  const managementQuery = subjectStart >= 0 ? location?.mailTo?.slice(subjectStart) : ``;
  const pageAllowsSignups = page.yaml?.showSignupButtons !== false;

  return {
    page,
    showSignupButtons: pageAllowsSignups && signupChapterSlugs.includes(`/${path}`),
    showContact:
      page.yaml?.showContact === true || (page.yaml?.showContact !== false && pageAllowsSignups),
    contactEmails,
    managementLink: managementEmail ? `mailto:${managementEmail}${managementQuery}` : null,
  };
};
