"use client";

import { userOptions } from "@/lib/options";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

export const AuthBoundary = ({
  fallback,
  children,
}: Readonly<{
  fallback: ReactNode;
  children: ReactNode;
}>) => {
  const { data: user } = useQuery(userOptions());

  if (user?.id) return <>{children}</>;

  return <>{fallback}</>;
};
