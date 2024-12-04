"use server";

import { associatedGuildsOption } from "@/app/(dashboard)/explorer/options";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { fetchGuildApi } from "@/lib/fetchGuildApi";
import { getQueryClient } from "@/lib/getQueryClient";
import { userOptions } from "@/lib/options";
import { authSchema, tokenSchema } from "@/lib/schemas/user";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}) => {
  const cookieStore = await cookies();

  const requestInit = {
    method: "POST",
    body: JSON.stringify({
      message,
      signature,
    }),
  } satisfies RequestInit;

  const signInRes = await fetchGuildApi("auth/siwe/login", requestInit);
  let json = signInRes.data;
  if (signInRes.response.status === 401) {
    const registerRes = await fetchGuildApi("auth/siwe/register", requestInit);
    json = registerRes.data;
  }
  const authData = authSchema.parse(json);
  const { exp } = tokenSchema.parse(jwtDecode(authData.token));

  cookieStore.set(GUILD_AUTH_COOKIE_NAME, authData.token, {
    expires: new Date(exp * 1000),
  });
  return authData;
};

export const signOut = async (redirectTo?: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(GUILD_AUTH_COOKIE_NAME);
  const queryClient = getQueryClient();
  queryClient.removeQueries(associatedGuildsOption());
  queryClient.removeQueries(userOptions());
  redirect(redirectTo ?? "/explorer");
};
