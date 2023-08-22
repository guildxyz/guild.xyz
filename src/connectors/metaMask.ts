import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"

const initializeMetaMaskConnector = (): [MetaMask, Web3ReactHooks, "metamask"] => {
  /**
   * In edge runtime, the initializeConnector won't work, so as a workaround we're
   * using a try-catch here and returning an array with undefined values. This won't
   * cause a problem, because this function will run and return proper values when
   * we're not on an edge runtime
   */
  try {
    const [metaMask, hooks] = initializeConnector<MetaMask>(
      (actions) =>
        new MetaMask({
          actions,
          options: {
            silent: true,
          },
        })
    )

    return [metaMask, hooks, "metamask"]
  } catch (_) {
    return [undefined, undefined, undefined]
  }
}

export default initializeMetaMaskConnector
