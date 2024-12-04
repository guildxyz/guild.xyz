import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { getTokenClientSide } from "@/lib/getCookieClientSide";
import { tokenSchema } from "@/lib/schemas/user";
import { isServer } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

export const tryGetToken = async () => {
  let token: string | undefined;
  if (isServer) {
    const { cookies } = await import("next/headers");
    token = (await cookies()).get(GUILD_AUTH_COOKIE_NAME)?.value;
  } else {
    token = getTokenClientSide();
  }

  if (!token) {
    throw new Error(
      "Failed to retrieve JWT token on auth request initialization.",
    );
  }
  return token;
};

export const tryGetParsedToken = async () => {
  const token = await tryGetToken();
  return tokenSchema.parse(jwtDecode(token));
};
