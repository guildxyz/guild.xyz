"use client"

import { PropsWithChildren } from "react"
import { SWRConfig, type SWRConfiguration } from "swr"

export const ExplorerSWRProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: SWRConfiguration }>) => {
  return <SWRConfig value={value}>{children}</SWRConfig>
}
