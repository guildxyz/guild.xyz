import { env } from "./env";

export const fetcher = async <Data = unknown, Error = unknown>(
  resource: string,
  {
    body,
    ...init
    // biome-ignore lint: -
  }: Omit<RequestInit, "body"> & { body?: Record<string, any> } = {},
) => {
  const options = {
    ...(body
      ? {
          method: "POST",
          body: JSON.stringify(body),
        }
      : {}),
    ...init,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  };

  return fetch(resource, options).then(async (response: Response) => {
    const contentType = response.headers.get("content-type");
    const res = contentType?.includes("json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (resource.includes(env.NEXT_PUBLIC_API)) {
        return Promise.reject({
          error: res.error,
        } as { error: string });
      }

      return Promise.reject(res as Error);
    }

    return res as Data;
  });
};
