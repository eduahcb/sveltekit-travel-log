import type { RequestHandler } from "@sveltejs/kit";
import { S3_BUCKET } from "$env/static/private";

import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { createS3Client } from "$lib/server/client-s3";
import { deleteLocationLogImage } from "$lib/server/db/queries/location-log-image";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { json } from "@sveltejs/kit";

export const DELETE: RequestHandler = AuthenticatedRequestHandler(async ({ params, locals, fetch }) => {
  const slug = params.slug;
  const id = Number(params.id);
  const imageId = Number(params.imageId);
  const userId = Number(locals.session!.user.id);

  await fetch(`/api/locations/${slug}/logs/${id}`);

  const client = createS3Client();

  try {
    const deleted = await deleteLocationLogImage(userId, imageId);

    if (!deleted) {
      return json({
        msg: "Image not found",
      }, {
        status: 404,
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: deleted.key,
    });

    await client.send(command);

    return new Response(null, { status: 204 });
  } catch {
    return json({
      msg: "Failed to delete image",
    }, {
      status: 500,
    });
  }
});
