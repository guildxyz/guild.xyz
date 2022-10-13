import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { RPC } from "connectors"

const initializeCoinbaseWalletConnector = (): [CoinbaseWallet, Web3ReactHooks] => {
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
