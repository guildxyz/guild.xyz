import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect-v2"
import { RPC } from "connectors"

const initializeWalletConnectConnector = (): [WalletConnect, Web3ReactHooks] => {
  /**
   * In edge runtime, the initializeConnector won't work, so as a workaround we're
   * using a try-catch here and returning an array with undefined values. This won't
   * cause a problem, because this function will run and return proper values when
   * we're not on an edge runtime
   */
  try {
    const [walletConnect, hooks] = initializeConnector<WalletConnect>(
      (actions) =>
        new WalletConnect({
          actions,
          options: {
            projectId: "5253997ecb729d8465fc4aa656937d43",
            showQrModal: true,
            chains: Object.values(RPC).map((chain) => chain.chainId),
            qrModalOptions: {
              explorerAllowList: [],
              explorerDenyList: [],
              themeVariables: {
                "--w3m-z-index": "10001",
              },
            },
          },
        })
    )

    return [walletConnect, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeWalletConnectConnector
