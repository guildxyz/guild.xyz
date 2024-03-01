import { Chain } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { InjectedConnectorOptions } from "./types"

export class RabbyConnector extends InjectedConnector {
  readonly id = "rabby"
  readonly name = "Rabby Wallet"
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
        const rabby = window.rabby
        if (!rabby) return
        this._state = rabby._state
        return rabby
      },
      ...options_,
    }
    super({ chains, options })

    this.ready = !!options.getProvider()
  }
  async connect(params) {
    if (!(await this.getProvider())) window.open("https://rabby.io/", "_blank")
    return super.connect(params)
  }
}
