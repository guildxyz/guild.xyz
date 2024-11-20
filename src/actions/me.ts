"use server";

import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { cookies } from "next/headers";

export async function me() {
  const token = (await cookies()).get(GUILD_AUTH_COOKIE_NAME);
  const response = await fetch(`${env.NEXT_PUBLIC_API}/auth/me`, {
    headers: { "X-Auth-Token": token?.value || "" },
  });

  return response.json();
}
