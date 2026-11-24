import { dev } from "$app/environment";
import { fetch_chapters, parse_form_data } from "$lib/fetch";
import type { Form, FormMessages, FormSelectOptions } from "$lib/types";

type SignupKind = `student` | `pupil`;

const modules = import.meta.glob(`../../signup-form/*/{student,pupil,messages,options}.yml`, {
  eager: true,
  import: `default`,
});

function formConfig<T>(country: string | undefined, name: string): T {
  const path = (locale: string) => `../../signup-form/${locale}/${name}.yml`;
  const config = modules[path(country ?? `de`)] ?? modules[path(`de`)];
  if (!config) throw new Error(`Missing signup form configuration: ${name}.yml`);
  return config as T;
}

export async function loadSignupForm(
  kind: SignupKind,
  country: string | undefined,
  fetch: typeof globalThis.fetch,
) {
  const chapters = (await fetch_chapters(fetch)).filter((chapter) => chapter.acceptsSignups);
  const testBaseId = import.meta.env.VITE_AIRTABLE_TEST_BASE_ID;
  if (dev && testBaseId) {
    chapters.unshift({
      title: `Test`,
      baseId: testBaseId,
      acceptsSignups: true,
      slug: `test`,
      coords: { lat: 0, lng: 0 },
      status: null,
      token: ``,
    });
  }

  const options = formConfig<FormSelectOptions>(country, `options`);
  // Markdown conversion mutates nested fields, so clone the imported YAML for each load.
  const form = parse_form_data(
    globalThis.structuredClone({
      ...formConfig<Form>(country, kind),
      ...formConfig<FormMessages>(country, `messages`),
    }),
  );
  for (const field of form.fields) {
    if (field.id in options) field.options = options[field.id];
    else if (field.id === `chapter`) field.options = chapters.map(({ title }) => title);
  }

  return { chapters, form };
}
