import type { Chain, WindowProvider } from "@wagmi/core"
import { InjectedConnector } from "@wagmi/core/connectors/injected"
import { getAddress } from "viem"

// -- Helpers ----------------------------------------------------------
const connectedRdnsKey = "connectedRdns"

// -- Types ------------------------------------------------------------
interface Info {
  uuid: string
  name: string
  icon: string
  rdns: string
}

interface EIP6963Wallet {
  info: Info
  provider: WindowProvider
}

interface ConnectOptions {
  chainId?: number
}

interface Config {
  chains?: Chain[]
}

// -- Connector --------------------------------------------------------
export class EIP6963Connector extends InjectedConnector {
  override readonly id: string = "eip6963"

  override readonly name: string = "EIP6963"

  _defaultProvider?: WindowProvider = undefined

  _eip6963Wallet?: EIP6963Wallet = undefined

  public constructor(config: Config) {
    super({ chains: config.chains, options: { shimDisconnect: true } })
    this._defaultProvider = this.options.getProvider()
  }

  // -- Wagmi Methods ---------------------------------------------------
  public override async connect(options: ConnectOptions) {
    const data = await super.connect(options)
    if (this._eip6963Wallet) {
      this.storage?.setItem(connectedRdnsKey, this._eip6963Wallet.info.rdns)
    }

    return data
  }

  protected override onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.storage?.removeItem(connectedRdnsKey)
      this.emit("disconnect")
    } else if (accounts[0]) {
      this.emit("change", {
        account: getAddress(accounts[0]),
      })
    }
  }

  public override async disconnect() {
    await super.disconnect()
    this.storage?.removeItem(connectedRdnsKey)
    this._eip6963Wallet = undefined
  }

  public override async isAuthorized(eip6963Wallet?: EIP6963Wallet) {
    const connectedEIP6963Rdns = this.storage?.getItem(connectedRdnsKey)
    if (connectedEIP6963Rdns) {
      if (
        this._eip6963Wallet &&
        connectedEIP6963Rdns === this._eip6963Wallet.info.rdns
      ) {
        const provider = this._eip6963Wallet.provider
        const accounts = (await provider.request({
          method: "eth_accounts",
        } as any)) as Array<any>
        if (accounts.length) {
          return true
        }
      }
      if (eip6963Wallet) {
        this._eip6963Wallet = eip6963Wallet
      }
    }

    return super.isAuthorized()
  }

  public override async getProvider() {
    return Promise.resolve(this._eip6963Wallet?.provider ?? this._defaultProvider)
  }

  // -- Extended Methods ------------------------------------------------
  public setEip6963Wallet(eip6963Wallet: EIP6963Wallet) {
    this._eip6963Wallet = eip6963Wallet
  }
}
