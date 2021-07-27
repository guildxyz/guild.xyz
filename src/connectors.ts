import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ethereum = 1,
  ropsten = 3,
  bsc = 56,
  bsctest = 97,
  polygon = 137,
}

const supportedChainIds = [Chains.polygon, Chains.ethereum, Chains.bsc]

const injected = new InjectedConnector({ supportedChainIds })

export { Chains, supportedChainIds }
export default injected
