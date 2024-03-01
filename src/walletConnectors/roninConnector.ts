import { Chain } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { InjectedConnectorOptions } from "./types"

export class RoninConnector extends InjectedConnector {
  readonly id = "ronin"
  readonly name = "Ronin Wallet"
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
        const ronin = window.ronin?.provider
        if (!ronin) return
        this._state = ronin._state
        return ronin
      },
      ...options_,
    }
    super({ chains, options })

    this.ready = !!options.getProvider()
  }
  async connect(params) {
    console.log("this.getProvider()", this.getProvider())
    if (!(await this.getProvider()))
      window.open("https://wallet.roninchain.com/", "_blank")
    return super.connect(params)
  }
}
