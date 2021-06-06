import { InjectedConnector } from "@web3-react/injected-connector"

const injected = new InjectedConnector({
  supportedChainIds: [1, 3],
})

export default injected
