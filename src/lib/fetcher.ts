import { env } from "./env";
import type { ErrorLike } from "./types";

export const fetcher = async <Data = unknown, Error = unknown>(
  resource: string,
  requestInit: RequestInit = {},
) =>
  fetch(resource, requestInit).then(async (response: Response) => {
    const contentType = response.headers.get("content-type");
    const res = contentType?.includes("json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (resource.includes(env.NEXT_PUBLIC_API)) {
        return Promise.reject({
          error: (res as ErrorLike).error || (res as ErrorLike).message,
        });
      }

      return Promise.reject(res as Error);
    }

    return res as Data;
  });
