import { CHAIN_CONFIG } from "chains"
import { createWalletClient, http } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { configureChains, mainnet } from "wagmi"
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
        chains: [mainnet],
        options: {
          walletClient: createWalletClient({
            account: mnemonicToAccount(process.env.NEXT_PUBLIC_E2E_WALLET_MNEMONIC),
            transport: http(mainnet.rpcUrls.default.http[0]),
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
