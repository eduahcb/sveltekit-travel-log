/* eslint-disable ts/consistent-type-definitions */
import { api } from "./client";

type Props = {
  slug: string;
  id: number;
  data: {
    contentLength: number;
    checksum: string;
  };
};

type Response = {
  url: string;
  key: string;
  fields: any;
};

export async function fetchSignLogImage({
  slug,
  id,
  data,
}: Props): Promise<Response> {
  return await api.post(`/api/locations/${slug}/logs/${id}/sign-image`, { json: data }).json();
}

export async function fetchUploadImage({ url, formData }: {
  url: string;
  formData: FormData;
}) {
  return await api.post(url, {
    body: formData,
    headers: {
      "x-amz-checksum-algorithm": "SHA256",
    },
  }).json();
}

type InsertImage = {
  slug: string;
  id: number;
  key: string;
  width: number;
  height: number;
};
export async function fetchInsertImage({ slug, id, key, width, height }: InsertImage) {
  return await api.post(`/api/locations/${slug}/logs/${id}/images`, { json: { key, width, height } }).json();
}

type DeleteImage = {
  slug: string;
  id: number;
  imageId: number;
};
export async function fetchDeleteImage({ slug, id, imageId }: DeleteImage) {
  await api.delete(`/api/locations/${slug}/logs/${id}/images/${imageId}`).json();
}
