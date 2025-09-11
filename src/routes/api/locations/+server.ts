import { LocationInsertSchema } from "$lib/schema/location";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";

import { UniqueConstraint } from "$lib/server/errors";

import { InsertLocation } from "$lib/server/services/insert-location";

import { formatValibotIssues } from "$lib/utils/valibot-format-error";

import { json } from "@sveltejs/kit";
import * as v from "valibot";

export const POST = AuthenticatedRequestHandler(async ({ request, locals }) => {
  const body = await request.json();

  const result = v.safeParse(LocationInsertSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validatedData = result.output;
  const userId = Number(locals.session?.user.id);

  const response = await InsertLocation.execute(validatedData, userId);

  if (!response.success) {
    if (response.value instanceof UniqueConstraint) {
      return json({ msg: response.value.message }, { status: 409 });
    }
    else {
      return json({ msg: response.value.message }, { status: 500 });
    }
  }

  return json({ location: response.value }, { status: 201 });
});
