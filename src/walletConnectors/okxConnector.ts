import { Chain } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { InjectedConnectorOptions } from "./types"

export class OkxConnector extends InjectedConnector {
  readonly id = "okx"
  readonly name = "OKX Wallet"
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
        const okxWallet = window.okxwallet
        if (okxWallet?.providers && okxWallet.providers.length > 0)
          return okxWallet.providers[0]
        return okxWallet
      },
      ...options_,
    }
    super({ chains, options })

    this.ready = !!options.getProvider()
  }
  async connect(params) {
    if (!(await this.getProvider()))
      window.open("https://www.okx.com/download", "_blank")
    return super.connect(params)
  }
}
