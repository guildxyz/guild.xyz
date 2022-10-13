import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { RPC_URLS } from "connectors"

const initializeWalletConnectConnector = (): [WalletConnect, Web3ReactHooks] => {
  try {
    const [walletConnect, hooks] = initializeConnector<WalletConnect>(
      (actions) =>
        new WalletConnect({
          actions,
          options: {
            rpc: RPC_URLS,
          },
        })
    )

    return [walletConnect, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeWalletConnectConnector
