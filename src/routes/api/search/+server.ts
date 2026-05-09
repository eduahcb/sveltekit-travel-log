import type { SearchResult } from "$lib/types";
import { NOMINATIM_URL } from "$lib/constants";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";

import { formatValibotIssues } from "$lib/utils/valibot-format-error";

import { json } from "@sveltejs/kit";

import * as v from "valibot";

const schema = v.object({
  q: v.pipe(
    v.string(),
    v.minLength(1),
    v.maxLength(200),
  ),
});

export const GET = AuthenticatedRequestHandler(async ({ url, fetch }) => {
  const q = url.searchParams.get("q");

  const result = v.safeParse(schema, { q });

  if (!result.success) {
    return json(formatValibotIssues(result.issues), { status: 400 });
  }

  const params = new URLSearchParams({
    q: result.output.q,
    format: "json",
  });

  const response = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: {
      "User-Agent": "sveltekit-travel-log",
    },
  });

  if (!response.ok) {
    return json({ message: "upstream geocoder request failed" }, { status: 502 });
  }

  const locations = (await response.json()) as SearchResult[];

  return json({ locations });
});
