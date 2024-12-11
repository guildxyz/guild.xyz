import { signOut } from "@/actions/auth";
import { tryGetToken } from "@/lib/token";
import { RequestHeader, ResponseHeader, Status } from "@reflet/http";
import { env } from "./env";
import { FetchError, ValidationError } from "./error";
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
    throw new ValidationError({
      cause: ValidationError.expected`${{ pathname }} must not start with slash`,
    });
  }
  if (pathname.endsWith("/")) {
    throw new ValidationError({
      cause: ValidationError.expected`${{ pathname }} must not end with slash`,
    });
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
    headers.set(RequestHeader.ContentType, "multipart/form-data");
  } else if (requestInit?.body) {
    headers.set(RequestHeader.ContentType, "application/json");
  }

  const response = await fetch(url, {
    ...requestInit,
    headers,
  });

  if (response.status === Status.Unauthorized) {
    signOut();
  }

  const contentType = response.headers.get(ResponseHeader.ContentType);
  if (!contentType?.includes("application/json")) {
    throw new FetchError({
      cause: FetchError.expected`JSON from Guild API response, instead received ${{ contentType }}`,
    });
  }

  logger.info({ response }, "\n", url.toString(), response.status);

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new FetchError({
      cause: FetchError.expected`to parse JSON from response`,
    });
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
    const { data, status, response } = await fetcher<Data, Error>(...args);
    const partialResponse = { status: response.status };
    return status === "error"
      ? Promise.reject({ data, partialResponse })
      : data;
  };
};

export const fetchGuildApiData = unpackFetcher(fetchGuildApi);
