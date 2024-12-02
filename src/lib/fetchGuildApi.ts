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

export const fetchGuildApi = async <Data = object, Error = ErrorLike>(
  pathName: string,
  requestInit?: RequestInit,
) => {
  if (pathName.startsWith("/")) {
    throw new Error("`pathName` must not start with slash");
  }
  if (pathName.endsWith("/")) {
    throw new Error("`pathName` must not end with slash");
  }

  const url = new URL(`api/${pathName}`, env.NEXT_PUBLIC_API);
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

export const fetchGuildApiData = async <Data = object, Error = ErrorLike>(
  pathName: string,
  requestInit?: RequestInit,
) => {
  if (pathName.startsWith("/")) {
    throw new Error("`pathName` must not start with slash");
  }
  if (pathName.endsWith("/")) {
    throw new Error("`pathName` must not end with slash");
  }

  const url = new URL(`api/${pathName}`, env.NEXT_PUBLIC_API);
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
  ...[pathName, requestInit = {}]: Parameters<typeof fetchGuildApi>
) => {
  const token = isServer
    ? await getToken()
    : getCookieClientSide(GUILD_AUTH_COOKIE_NAME);
  if (!token) {
    throw new Error(
      "Failed to retrieve JWT token on auth request initialization.",
    );
  }
  return fetchGuildApi<Data, Error>(pathName, {
    ...requestInit,
    headers: {
      ...requestInit?.headers,
      "X-Auth-Token": token,
    },
  });
};
