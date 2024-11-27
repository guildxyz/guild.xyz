"use server";

import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  message: z.string(),
  token: z.string(),
  userId: z.string().uuid(),
});

const tokenSchema = z.object({
  userId: z.string().uuid(),
  exp: z.number().positive().int(),
  iat: z.number().positive().int(),
});

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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      signature,
    }),
  } satisfies RequestInit;

  const signInRes = await fetch(
    `${env.NEXT_PUBLIC_API}/auth/siwe/login`,
    requestInit,
  );

  let json: unknown;
  if (signInRes.status === 401) {
    const registerRes = await fetch(
      `${env.NEXT_PUBLIC_API}/auth/siwe/register`,
      requestInit,
    );
    json = await registerRes.json();
  } else {
    json = await signInRes.json();
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
  redirect(redirectTo ?? "/explorer");
};

export const getAuthCookie = async () => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(GUILD_AUTH_COOKIE_NAME);
  return authCookie && tokenSchema.parse(jwtDecode(authCookie.value));
};
