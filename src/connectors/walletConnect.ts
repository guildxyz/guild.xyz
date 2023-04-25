import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { RPC_URLS } from "connectors"

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
          options: { rpc: RPC_URLS },
        })
    )

    return [walletConnect, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeWalletConnectConnector
