"use client";

import { userOptions } from "@/lib/options";
import { useQuery } from "@tanstack/react-query";

export const AuthBoundary = ({
  fallback,
  children,
}: Readonly<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}>) => {
  const { data: user } = useQuery(userOptions());

  if (user?.id) return children;

  return fallback;
};
