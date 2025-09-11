import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export function generateUniqueSlug(slug: string) {
  return `${slug}-${nanoid()}`;
}
