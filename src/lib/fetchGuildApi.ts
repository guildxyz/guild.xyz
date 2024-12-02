import { getToken } from "@/actions/auth";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { isServer } from "@tanstack/react-query";
import { env } from "./env";
import { getCookieClientSide } from "./getCookieClientSide";
import type { ErrorLike } from "./types";

// TODO: include a dedicated logger with severity channels
const logger = {
  info: (...args: Parameters<typeof console.info>) => {
    if (process.env.NODE_ENV === "development" && env.LOGGING) {
      console.info(
        `[${new Date().toLocaleTimeString()} - fetchGuildApi]:`,
        ...args,
      );
    }
  },
};

type FetchResult<Data, Error> =
  | { status: "error"; data: Error; response: Response }
  | { status: "success"; data: Data; response: Response };

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

export const fetchGuildApiData = async <Data = object, Error = ErrorLike>(
  pathname: string,
  requestInit?: RequestInit,
) => {
  if (pathname.startsWith("/")) {
    throw new Error("`pathname` must not start with slash");
  }
  if (pathname.endsWith("/")) {
    throw new Error("`pathname` must not end with slash");
  }

  const url = new URL(`api/${pathname}`, env.NEXT_PUBLIC_API);
  return fetch(url, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...requestInit?.headers,
    },
  }).then(async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      Promise.reject({ message: "Guild API failed respond with json" });
    }
    const json = await response.json();
    logger.info(url.toString(), json);
    if (!response.ok) {
      return Promise.reject(json as Error);
    }
    return Promise.resolve(json as Data);
  });
};

export const fetchGuildApiAuth = async <Data = object, Error = ErrorLike>(
  ...[pathname, requestInit = {}]: Parameters<typeof fetchGuildApi>
) => {
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
