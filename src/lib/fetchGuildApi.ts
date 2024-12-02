import { getToken } from "@/actions/auth";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { isServer } from "@tanstack/react-query";
import { env } from "./env";
import { getCookieClientSide } from "./getCookieClientSide";
import type { ErrorLike } from "./types";

type FetchResult<Data, Error> =
  | { status: "error"; data: Error; response: Response }
  | { status: "success"; data: Data; response: Response };

// TODO: include a dedicated logger with severity channels
const logger = {
  info: (...args: Parameters<typeof console.info>) => {
    if (process.env.NODE_ENV === "development" && env.LOGGING > 0) {
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
    throw new Error("`pathname` must not start with slash");
  }
  if (pathname.endsWith("/")) {
    throw new Error("`pathname` must not end with slash");
  }

  const url = new URL(`api/${pathname}`, env.NEXT_PUBLIC_API);
  const response = await fetch(url, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...requestInit?.headers,
    },
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Guild API failed respond with json");
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error("Failed to parse json from response");
  }

  logger.info(url.toString(), response.status, json);

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

/**
 * Fetcher used for creating authenticated requests to the v3 backend API.
 *
 * This function extends `fetchGuildApi` by automatically including an authentication
 * token in the request headers. The token is retrieved either server-side or client-side
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
 * const { data, status, response } = await fetchGuildApiAuth<{ user: string }>('user', {
 *  method: "POST",
 *  body: JSON.stringify({name: string}),
 * });
 *
 * if (status === 'error') {
 *   assert(!response.ok);
 *   console.error(data.message);
 * } else {
 *   console.log(data.user);
 * }
 * ```
 *
 * @throws If `pathname` starts or ends with a slash.
 * @throws If the API does not respond with JSON.
 * @throws If the response JSON cannot be parsed.
 * @throws If the JWT token cannot be retrieved.
 */
export const fetchGuildApiAuth = async <Data = object, Error = ErrorLike>(
  ...[pathname, requestInit = {}]: Parameters<typeof fetchGuildApi>
): Promise<FetchResult<Data, Error>> => {
  const token = isServer
    ? await getToken()
    : getCookieClientSide(GUILD_AUTH_COOKIE_NAME);
  if (!token) {
    throw new Error(
      "Failed to retrieve JWT token on auth request initialization.",
    );
  }
  return fetchGuildApi<Data, Error>(pathname, {
    ...requestInit,
    headers: {
      ...requestInit?.headers,
      "X-Auth-Token": token,
    },
  });
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
export const fetchGuildApiAuthData = unpackFetcher(fetchGuildApiAuth);
