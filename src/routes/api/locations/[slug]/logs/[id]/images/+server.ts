import type { RequestHandler } from "@sveltejs/kit";
import { S3_BUCKET } from "$env/static/private";

import { LocationLogImageSchema } from "$lib/schema";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { createS3Client } from "$lib/server/client-s3";
import { insertLocationLogImage } from "$lib/server/db/queries/location-log-image";
import { formatValibotIssues } from "$lib/utils/valibot-format-error";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { json } from "@sveltejs/kit";
import * as v from "valibot";

interface ObjectMetadata {
  "location-log-id": string;
  "user-id": string;
}

export const POST: RequestHandler = AuthenticatedRequestHandler(async ({ params, request, locals, fetch }) => {
  const slug = params.slug;
  const id = Number(params.id);
  const body = await request.json();
  const userId = Number(locals.session!.user.id);

  const result = v.safeParse(LocationLogImageSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validOutput = result.output;

  await fetch(`/api/locations/${slug}/logs/${id}`);

  const client = createS3Client();

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: validOutput.key,
  });

  const response = await client.send(command);
  const metadata = response.Metadata as ObjectMetadata | undefined;

  if (!metadata
    || metadata["location-log-id"] !== id.toString()
    || metadata["user-id"] !== userId.toString()) {
    return json({
      msg: "Image not found",
    }, {
      status: 404,
    });
  }

  try {
    const image = await insertLocationLogImage(userId, id, validOutput);

    return json({
      image,
    });
  } catch {
    return json({
      msg: "Failed to save image",
    }, {
      status: 500,
    });
  }
});
