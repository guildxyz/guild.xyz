import { signOut } from "@/actions/auth";
import { tryGetToken } from "@/lib/token";
import { env } from "./env";
import { ValidationError } from "./error";
import type { ErrorLike } from "./types";

type FetchResult<Data, Error> =
  | { status: "error"; data: Error; response: Response }
  | { status: "success"; data: Data; response: Response };

// TODO: include a dedicated logger with severity channels
const logger = {
  info: (
    { response }: { response: Response },
    ...args: Parameters<typeof console.info>
  ) => {
    if (
      process.env.NODE_ENV === "development" &&
      env.LOGGING > 0 &&
      !response.ok
    ) {
      console.info(
        `[${new Date().toLocaleTimeString()} - fetchGuildApi]:`,
        ...args,
      );
    }
  },
};

/**
 * Fetcher used for creating requests to the v3 backend API.
 *
 * This function sends a request to the specified `pathname` of the API and returns
 * a structured result containing the response, status, and data. It ensures that the API transmission is with valid JSON.
 *
 * Authentication token is retrieved and automatically included in the request headers. The token is retrieved either server-side or client-side
 * depending on the runtime environment.
 *
 * @template Data - The expected shape of the success response data.
 * @template Error - The expected shape of the error response data.
 *
 * @param pathname - The API endpoint to fetch, without leading or trailing slashes.
 * @param requestInit - Optional configuration for the fetch request.
 *
 * @returns A promise resolving to the fetch result,
 * containing `status`, `data`, and `response`.
 *
 * @example
 * ```ts
 * const { data, status, response } = await fetchGuildApi<{ name: string }>('guild');
 *
 * if (status === 'error') {
 *   assert(!response.ok);
 * } else {
 *   console.log(data.name);
 * }
 * ```
 *
 * @throws If `pathname` starts or ends with a slash.
 * @throws If the API does not respond with JSON.
 * @throws If the response JSON cannot be parsed.
 */
export const fetchGuildApi = async <Data = object, Error = ErrorLike>(
  pathname: string,
  requestInit?: RequestInit,
): Promise<FetchResult<Data, Error>> => {
  if (pathname.startsWith("/")) {
    throw new ValidationError(
      `"pathname" must not start with slash: ${pathname}`,
    );
  }
  if (pathname.endsWith("/")) {
    throw new ValidationError(
      `"pathname" must not end with slash: ${pathname}`,
    );
  }
  const url = new URL(`api/${pathname}`, env.NEXT_PUBLIC_API);

  let token: string | undefined;
  try {
    token = await tryGetToken();
  } catch (_) {}

  const headers = new Headers(requestInit?.headers);
  if (token) {
    headers.set("X-Auth-Token", token);
  }
  if (requestInit?.body instanceof FormData) {
    headers.set("Content-Type", "multipart/form-data");
  } else if (requestInit?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...requestInit,
    headers,
  });

  if (response.status === 401) {
    signOut();
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error("Guild API failed to respond with json");
  }

  logger.info({ response }, "\n", url.toString(), response.status);

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error("Failed to parse json from response");
  }

  logger.info({ response }, json, "\n");

  if (!response.ok) {
    return {
      status: "error",
      data: json as Error,
      response,
    };
  }
  return {
    status: "success",
    data: json as Data,
    response,
  };
};

const unpackFetcher = (fetcher: typeof fetchGuildApi) => {
  return async <Data = object, Error = ErrorLike>(
    ...args: Parameters<typeof fetchGuildApi>
  ) => {
    const { data, status } = await fetcher<Data, Error>(...args);
    return status === "error" ? Promise.reject(data) : data;
  };
};

export const fetchGuildApiData = unpackFetcher(fetchGuildApi);
