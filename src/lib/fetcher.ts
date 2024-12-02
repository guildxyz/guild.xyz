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
      console.info(`[${new Date().toLocaleTimeString()} - fetcher]:`, ...args);
    }
  },
};

export const fetchGuildApi = async <Data = object, Error = ErrorLike>(
  ...[pathName, requestInit = {}]: [string, RequestInit]
) => {
  if (pathName.startsWith("/")) {
    throw new Error("`pathName` must not start with slash");
  }
  if (pathName.endsWith("/")) {
    throw new Error("`pathName` must not end with slash");
  }

  //if (requestInit.auth) {
  //  const token = isServer
  //    ? await getToken()
  //    : getCookieClientSide(GUILD_AUTH_COOKIE_NAME);
  //  if (!token) {
  //    throw new Error(
  //      "failed to retrieve jwt token on auth request initialization",
  //    );
  //  }
  //}

  const token = isServer
    ? await getToken()
    : getCookieClientSide(GUILD_AUTH_COOKIE_NAME);
  if (!token) {
    throw new Error(
      "failed to retrieve jwt token on auth request initialization",
    );
  }

  const url = new URL(`api/${pathName}`, env.NEXT_PUBLIC_API);

  return fetch(url, {
    ...requestInit,
    headers: { ...requestInit?.headers, "X-Auth-Token": token },
  }).then(async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      Promise.reject({ message: "Guild API failed respond with json" });
    }
    const res = await response.json();
    logger.info(url.toString(), res);
    if (!response.ok) {
      return Promise.reject(res as Error);
    }
    return res as Data;
  });
};

//const fetchGuildApiAuth = (...[pathName, requestInit = {}]: Parameters<typeof fetchGuildApi>) => {
//  return fetchGuildApi()
//};

export const fetcher = async <Data = unknown, Error = unknown>(
  resource: string,
  requestInit: RequestInit = {},
) =>
  fetch(resource, requestInit).then(async (response: Response) => {
    const contentType = response.headers.get("content-type");
    const res = contentType?.includes("json")
      ? await response.json()
      : await response.text();

    if (process.env.NODE_ENV === "development") {
      console.info(
        `[${new Date().toLocaleTimeString()} - fetcher]: ${resource}`,
        res,
      );
    }

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
