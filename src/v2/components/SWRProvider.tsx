"use client"

import { PropsWithChildren } from "react"
import { SWRConfig, type SWRConfiguration } from "swr"

export const SWRProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: SWRConfiguration }>) => {
  return <SWRConfig value={value}>{children}</SWRConfig>
}
