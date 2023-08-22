import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect-v2"
import { RPC } from "connectors"

const initializeWalletConnectConnector = (): [
  WalletConnect,
  Web3ReactHooks,
  "walletconnect"
] => {
  /**
   * In edge runtime, the initializeConnector won't work, so as a workaround we're
   * using a try-catch here and returning an array with undefined values. This won't
   * cause a problem, because this function will run and return proper values when
   * we're not on an edge runtime
   */
  try {
    const [walletConnect, hooks] = initializeConnector<WalletConnect>((actions) => {
      const supportedChainIds = Object.entries(RPC).map(
        ([_, chainData]) => chainData.chainId
      )
      const [mainnet, ...optionalChains] = supportedChainIds

      return new WalletConnect({
        actions,
        options: {
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          chains: [mainnet],
          optionalChains,
          showQrModal: true,
          qrModalOptions: {
            themeVariables: {
              "--wcm-z-index": "10001",
            },
          },
        },
      })
    })

    return [walletConnect, hooks, "walletconnect"]
  } catch (_) {
    return [undefined, undefined, undefined]
  }
}

export default initializeWalletConnectConnector
