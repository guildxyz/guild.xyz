import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"

const initializeMetaMaskConnector = (): [MetaMask, Web3ReactHooks] => {
  const [metaMask, hooks] = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions })
  )

  return [metaMask, hooks]
}

export default initializeMetaMaskConnector
