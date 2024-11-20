"use server";

import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  message: z.string(),
  token: z.string(),
  userId: z.string().uuid(),
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
    `${process.env.NEXT_PUBLIC_API}/auth/siwe/login`,
    requestInit,
  );

  if (signInRes.status === 401) {
    const registerRes = await fetch(
      `${process.env.NEXT_PUBLIC_API}/auth/siwe/register`,
      requestInit,
    );
    const json = await registerRes.json();

    const registerData = authSchema.parse(json);
    cookieStore.set(GUILD_AUTH_COOKIE_NAME, registerData.token);

    return registerData;
  }

  const json = await signInRes.json();

  const signInData = authSchema.parse(json);

  cookieStore.set(GUILD_AUTH_COOKIE_NAME, signInData.token);

  return signInData;
};

export const signOut = async (redirectTo?: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(GUILD_AUTH_COOKIE_NAME);
  redirect(redirectTo ?? "/explorer");
};
