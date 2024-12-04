"use client";

import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";

export const getCookieClientSide = (name: string) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookie.split(";");

  for (let i = 0; i < cookiesArray.length; i++) {
    const [cookieName, cookieValue] = cookiesArray[i]
      .split("=")
      .map((v) => v.trim());
    if (cookieName === name) return cookieValue;
  }

  return undefined;
};

export const getTokenClientSide = () => {
  return getCookieClientSide(GUILD_AUTH_COOKIE_NAME);
};
