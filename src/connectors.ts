import { CHAIN_CONFIG } from "chains"
import { configureChains } from "wagmi"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { SafeConnector } from "wagmi/connectors/safe"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { publicProvider } from "wagmi/providers/public"

const { chains, publicClient } = configureChains(Object.values(CHAIN_CONFIG), [
  publicProvider(),
])

const connectors = [
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
          "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c", // Bitcoin.com
          "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
          "2c81da3add65899baeac53758a07e652eea46dbb5195b8074772c62a77bbf568", // Ambire
        ],
        themeVariables: {
          "--wcm-z-index": "10001",
        },
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
]

export { connectors, publicClient }
