import { WindowProvider } from "wagmi"

type SimpleWalletProviders = Partial<
  Record<"okxwallet" | "ethereum" | "rabby", WindowProvider>
>

declare global {
  interface Window extends SimpleWalletProviders {
    ronin?: { provider: WindowProvider }
  }
}

export type InjectedConnectorOptions = {
  name?: string | ((detectedName: string | string[]) => string)
  getProvider?: () => WindowProvider | undefined
  shimDisconnect?: boolean
}
