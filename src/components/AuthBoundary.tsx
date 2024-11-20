import { cookies } from "next/headers";
import { GUILD_AUTH_COOKIE_NAME } from "../config/constants";

export const AuthBoundary = async ({
  fallback,
  children,
}: Readonly<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(GUILD_AUTH_COOKIE_NAME);

  if (!authCookie) return <>{fallback}</>;

  return <>{children}</>;
};
