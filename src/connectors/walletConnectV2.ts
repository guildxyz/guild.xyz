import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2"
import { RPC } from "connectors"

const initializeWalletConnectV2Connector = (): [WalletConnectV2, Web3ReactHooks] => {
  /**
   * In edge runtime, the initializeConnector won't work, so as a workaround we're
   * using a try-catch here and returning an array with undefined values. This won't
   * cause a problem, because this function will run and return proper values when
   * we're not on an edge runtime
   */
  try {
    const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
      (actions) => {
        const supportedChainIds = Object.entries(RPC).map(
          ([_, chainData]) => chainData.chainId
        )
        const [mainnet, ...optionalChains] = supportedChainIds

        return new WalletConnectV2({
          actions,
          options: {
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            chains: [mainnet],
            optionalChains,
            showQrModal: true,
            qrModalOptions: {
              themeVariables: {
                "--w3m-z-index": "10001",
              },
            },
          },
        })
      }
    )

    return [walletConnectV2, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeWalletConnectV2Connector
