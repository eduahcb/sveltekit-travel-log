import type { RequestHandler } from "@sveltejs/kit";
import { S3_BUCKET } from "$env/static/private";

import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";

import { createS3Client } from "$lib/server/client-s3";
import { formatValibotIssues } from "$lib/utils/valibot-format-error";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { json } from "@sveltejs/kit";
import * as v from "valibot";

const MAX_CONTENT_LENGTH = 1024 * 1024 * 0.5;

const ImageSchema = v.object({
  contentLength: v.pipe(
    v.number(),
    v.minValue(1),
    v.maxValue(MAX_CONTENT_LENGTH, "Content is too long"),
  ),
  checksum: v.string(),
});

export const POST: RequestHandler = AuthenticatedRequestHandler(async ({ params, request, locals, fetch }) => {
  const slug = params.slug;
  const id = params.id;
  const body = await request.json();
  const userId = Number(locals.session!.user.id);

  const result = v.safeParse(ImageSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const filename = crypto.randomUUID();
  const validatedData = result.output;
  const key = `${userId}/${id}/${filename}.jpg`;

  await fetch(`/api/locations/${slug}/logs/${id}`);

  const client = createS3Client();

  try {
    const { url, fields } = await createPresignedPost(client, {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: 120,
      Fields: {
        "x-amz-checksum-sha256": validatedData.checksum,
      },
      Conditions: [
        ["content-length-range", validatedData.contentLength, validatedData.contentLength],
        ["eq", "$x-amz-meta-user-id", userId.toString()],
        ["eq", "$x-amz-meta-location-log-id", id!],
      ],
    });

    fields["x-amz-meta-user-id"] = userId.toString();
    fields["x-amz-meta-location-log-id"] = id!;

    return json({
      url,
      fields,
      key,
    });
  } catch {
    return json({
      msg: "Unexpected error",
    }, {
      status: 500,
    });
  }
});
