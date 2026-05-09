import type { SearchResult } from "$lib/types";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { formatValibotIssues } from "$lib/utils/valibot-format-error";

import { json } from "@sveltejs/kit";

import * as v from "valibot";

const NOMINATIN_URL = "https://nominatim.openstreetmap.org";

const schema = v.object({
  q: v.pipe(
    v.string(),
    v.minLength(1),
  ),
});

export const GET = AuthenticatedRequestHandler(async ({ url, fetch }) => {
  const q = url.searchParams.get("q");

  const result = v.safeParse(schema, {
    q,
  });

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validResult = result.output;

  const response = await fetch(`${NOMINATIN_URL}/search?q=${validResult.q}&format=json`, {
    headers: {
      "User-Agent": "sveltekit-travel-log",
    },
  });

  if (!response.ok) {
    return json({
      msg: "failed to search for location",
    });
  }
  const data = await response.json();
  const locations = data as SearchResult[];

  return json({
    locations,
  });
});
