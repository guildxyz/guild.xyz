import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ethereum = 1,
  ropsten = 3,
  bsc = 56,
  bsctest = 97,
}

const injected = new InjectedConnector({
  supportedChainIds: [Chains.bsctest],
})

export { Chains }
export default injected
