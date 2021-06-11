import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ethereum = 1,
  ropsten = 3,
}

const injected = new InjectedConnector({
  supportedChainIds: [/* Chains.MAINNET, */ Chains.ropsten],
})

export { Chains }
export default injected
