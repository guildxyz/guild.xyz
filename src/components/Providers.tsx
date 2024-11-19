"use client";

import { ThemeProvider } from "next-themes";
import type { FunctionComponent, PropsWithChildren } from "react";

export const CsrProviders: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
