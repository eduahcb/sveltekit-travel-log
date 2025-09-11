export type Response<T, E>
  = | { success: true; value: T }
    | { success: false; value: E };
