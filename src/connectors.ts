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
        themeVariables: {
          "--wcm-z-index": "10001",
        },
      },
    },
  }),
  new SafeConnector({
    chains,
    options: {
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: false,
    },
  }),
]

export { connectors, publicClient }
