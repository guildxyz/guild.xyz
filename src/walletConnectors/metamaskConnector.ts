import { Chain } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { InjectedConnectorOptions } from "./types"

export class MetamaskConnector extends InjectedConnector {
  readonly id = "metam"
  readonly name = "MetaMask Wallet"
  readonly ready: boolean

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[]
    options?: InjectedConnectorOptions
  } = {}) {
    const options: InjectedConnectorOptions = {
      shimDisconnect: true,
      getProvider() {
        if (typeof window === "undefined") return
        const ethereum = window.ethereum
        if (!ethereum?.isMetaMask) return
        if (ethereum?.providers && ethereum.providers.length > 0)
          return ethereum.providers[0]
        return ethereum
      },
      ...options_,
    }
    super({ chains, options })

    this.ready = !!options.getProvider()
  }
  connect(params) {
    if (!this.getProvider()) window.open("https://metamask.io/download/", "_blank")
    return super.connect(params)
  }
}
