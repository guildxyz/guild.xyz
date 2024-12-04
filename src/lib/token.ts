import { getTokenServerSide } from "@/actions/auth";
import { getTokenClientSide } from "@/lib/getCookieClientSide";
import { tokenSchema } from "@/lib/schemas/user";
import { isServer } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

export const tryGetToken = async () => {
  const token = isServer ? await getTokenServerSide() : getTokenClientSide();

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
