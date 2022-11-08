import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { RPC } from "connectors"

const initializeCoinbaseWalletConnector = (): [CoinbaseWallet, Web3ReactHooks] => {
  /**
   * In edge runtime, the initializeConnector won't work, so as a workaround we're
   * using a try-catch here and returning an array with undefined values. This won't
   * cause a problem, because this function will run and return proper values when
   * we're not on an edge runtime
   */
  try {
    const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
      (actions) =>
        new CoinbaseWallet({
          actions,
          options: {
            url: RPC.ETHEREUM.rpcUrls[0],
            appName: "Guild.xyz",
          },
        })
    )

    return [coinbaseWallet, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeCoinbaseWalletConnector
