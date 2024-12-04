import { getTokenServerSide } from "@/actions/auth";

export const AuthBoundary = async ({
  fallback,
  children,
}: Readonly<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}>) => {
  try {
    await getTokenServerSide();
    return <>{children}</>;
  } catch {
    return <>{fallback}</>;
  }
};
