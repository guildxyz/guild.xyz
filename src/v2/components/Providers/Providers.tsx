"use client"
import { QueryClient } from "@tanstack/react-query"
import { env } from "env"
import { useAtomValue } from "jotai"
import { ThemeProvider } from "next-themes"
import dynamic from "next/dynamic"
import { ReactNode } from "react"
import { SWRConfig } from "swr"
import { fetcherForSWR } from "utils/fetcher"
import { shouldUseReCAPTCHAAtom } from "utils/recaptcha"
import { Toaster } from "../ui/Toaster"
import { TooltipProvider } from "../ui/Tooltip"

const DynamicReCAPTCHA = dynamic(() => import("v2/components/ReCAPTCHA"))

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const shouldUseReCAPTCHA = useAtomValue(shouldUseReCAPTCHAAtom)

  return (
    <>
      <ThemeProvider
        attribute="data-theme"
        storageKey="chakra-ui-color-mode"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <SWRConfig value={{ fetcher: fetcherForSWR }}>{children}</SWRConfig>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>

      {shouldUseReCAPTCHA && (
        <DynamicReCAPTCHA
          sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
      )}
    </>
  )
}
