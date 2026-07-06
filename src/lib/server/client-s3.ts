import { S3_ACCESS_KEY, S3_ENDPOINT, S3_REGION, S3_SECRET_KEY } from "$env/static/private";
import { S3Client } from "@aws-sdk/client-s3";

export function createS3Client() {
  return new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });
}
