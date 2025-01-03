"use client";

import { useUser } from "@/hooks/useUser";
import type { ReactNode } from "react";

export const AuthBoundary = ({
  fallback,
  children,
}: Readonly<{
  fallback: ReactNode;
  children: ReactNode;
}>) => {
  const { data: user } = useUser();

  if (user?.id) return children;

  return fallback;
};
