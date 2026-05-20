import ky from "ky";

export const api = ky.create({
  retry: 0,
});
