import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"

const initializeMetaMaskConnector = (): [MetaMask, Web3ReactHooks] => {
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

    return [metaMask, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeMetaMaskConnector
