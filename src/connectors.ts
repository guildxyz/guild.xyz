import { CHAIN_CONFIG } from "chains"
import fetcher from "utils/fetcher"
import { createWalletClient, http } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { CWaaSConnector } from "waasConnector"
import { configureChains } from "wagmi"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MockConnector } from "wagmi/connectors/mock"
import { SafeConnector } from "wagmi/connectors/safe"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { publicProvider } from "wagmi/providers/public"

const { chains, publicClient } = configureChains(Object.values(CHAIN_CONFIG), [
  publicProvider(),
])

const connectors = process.env.NEXT_PUBLIC_MOCK_CONNECTOR
  ? [
      new MockConnector({
        chains: chains,
        options: {
          walletClient: createWalletClient({
            account: mnemonicToAccount(process.env.NEXT_PUBLIC_E2E_WALLET_MNEMONIC),
            chain: chains[0],
            transport: http(),
          }),
        },
      }),
    ]
  : [
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "Guild.xyz",
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          showQrModal: true,
          qrModalOptions: {
            explorerRecommendedWalletIds: [
              "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX
              "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c", // Bitcoin.com
              "541d5dcd4ede02f3afaf75bf8e3e4c4f1fb09edb5fa6c4377ebf31c2785d9adf", // Ronin
              "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
            ],
            themeVariables: {
              "--wcm-z-index": "10001",
              "--w3m-z-index": "10001",
            } as any, // casting it, so `--wcm-z-index` is accepted
          },
        },
      }),
      new SafeConnector({
        chains,
        options: {
          allowedDomains: [/gnosis-safe\.io$/, /app\.safe\.global$/],
          debug: false,
        },
      }),
      new CWaaSConnector({
        chains,
        options: {
          provideAuthToken: async () => {
            const token = await fetcher("/v2/third-party/coinbase/token")
            return token
          },
          collectAndReportMetrics: true,
          prod:
            (typeof window !== "undefined" &&
              window.origin === "https://guild.xyz") ||
            undefined,
        },
      }),
    ]

export { connectors, publicClient }
