import { tryGetToken } from "@/lib/token";

export const AuthBoundary = async ({
  fallback,
  children,
}: Readonly<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}>) => {
  try {
    await tryGetToken();
    return <>{children}</>;
  } catch {
    return <>{fallback}</>;
  }
};
