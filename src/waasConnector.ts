// eslint-disable-next-line import/no-extraneous-dependencies
import { toViem } from "@coinbase/waas-sdk-viem"
import type {
  Address,
  InitializeWaasOptions,
  NewWallet,
  ProtocolFamily,
  Waas,
  Wallet,
} from "@coinbase/waas-sdk-web"
import { LocalAccount, createWalletClient, http } from "viem"
import { Chain, Connector, WalletClient } from "wagmi"

let cwaasModule: typeof import("@coinbase/waas-sdk-web")
const cwaasImport = async () => {
  if (cwaasModule) return cwaasModule
  // eslint-disable-next-line import/no-extraneous-dependencies
  const mod = await import("@coinbase/waas-sdk-web")
  cwaasModule = mod
  return mod
}

export class CWaaSConnector extends Connector<Waas, InitializeWaasOptions> {
  readonly id = "cwaasWallet"

  readonly name = "Coinbase WaaS"

  readonly ready = true

  _chainId: number

  _waas?: Waas

  _currentAddress: Address<ProtocolFamily>

  private throwIfNoWallet() {
    if (!this._waas) {
      throw new Error("CWaaS SDK is not initialized")
    }

    if (!this._waas.wallets.wallet) {
      throw new Error("Create or restore a CWaaS wallet")
    }
  }

  async getProvider() {
    try {
      if (!this._waas) {
        const { InitializeWaas } = await cwaasImport()

        const waas = await InitializeWaas(this.options)
        this._waas = waas
      }

      return this._waas
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async connect(config?: { chainId?: number; backup?: string }) {
    this.emit("message", { type: "connecting" })

    await this.getProvider()
    this.throwIfNoWallet()

    const addresses = await this.getAllEvmAddresses()

    this._chainId = config?.chainId ?? 1

    this._currentAddress ||= addresses[0]

    return {
      account: this._currentAddress.address,
      chain: {
        id: config?.chainId,
        unsupported: false,
      },
    }
  }

  async disconnect(): Promise<void> {
    this.emit("disconnect")
  }

  async getAccount(): Promise<`0x${string}`> {
    this.throwIfNoWallet()

    return this._currentAddress.address
  }

  async getChainId(): Promise<number> {
    return this._chainId
  }

  async getWalletClient(config?: { chainId?: number }): Promise<WalletClient> {
    this.throwIfNoWallet()

    const account = toViem(this._currentAddress)

    const chain = this.chains.find(({ id }) => id === (config?.chainId ?? 1))

    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(), // chain.rpcUrls[0].http[0]
    })

    return walletClient
  }

  async isAuthorized(): Promise<boolean> {
    try {
      await this.getProvider()
      this.throwIfNoWallet()
      const { ProtocolFamily } = await cwaasImport()

      const waas = await this.getProvider()

      const addresses = await waas.wallets.wallet.addresses.for(ProtocolFamily.EVM)

      return !!addresses?.address
    } catch {
      return false
    }
  }

  async switchChain(chainId: number): Promise<Chain> {
    this._chainId = chainId
    await this.getWalletClient({ chainId })
    const chain = this.chains.find(({ id }) => id === chainId)
    this.onChainChanged(chainId)
    return chain
  }

  protected onAccountsChanged(accounts: `0x${string}`[]): void {
    if (accounts.length === 0) this.emit("disconnect")
    else this.emit("change", { account: this._currentAddress.address })
  }

  protected onChainChanged(chainId: string | number): void {
    this.emit("change", { chain: { id: +chainId, unsupported: false } })
  }

  protected onDisconnect(error: Error): void {
    this.emit("disconnect")
  }

  // Some utils

  private async withAccount<W extends Wallet>(wallet: W) {
    const waas = await this.getProvider()
    const { ProtocolFamily } = await cwaasImport()

    const address = await waas.wallets.wallet.addresses.for(ProtocolFamily.EVM)

    const account = toViem(address)

    return { wallet, account }
  }

  async createWallet(): Promise<{
    wallet: NewWallet
    account: LocalAccount
  }> {
    try {
      const waas = await this.getProvider()
      const { Logout, ProtocolFamily } = await cwaasImport()

      // if (!!waas.wallets.wallet) {
      //   this._currentAddress = (await waas.wallets.wallet.createAddress(
      //     ProtocolFamily.EVM
      //   )) as Address<ProtocolFamily>

      //   const viemAccount = toViem(this._currentAddress)
      //   return {
      //     wallet: waas.wallets.wallet,
      //     account: viemAccount,
      //   }
      // }

      if (waas.wallets.wallet) {
        // Not sure if this is right
        await Logout()
      }

      const wallet = await waas.wallets.create()
      this._currentAddress = await wallet.addresses.for(ProtocolFamily.EVM)
      const withViemAccount = await this.withAccount(wallet)
      return withViemAccount
    } catch (error) {
      console.error(error)
      throw new Error("Failed to create wallet")
    }
  }

  async restoreWallet(backupData: string) {
    try {
      const waas = await this.getProvider()
      const { Logout, ProtocolFamily } = await cwaasImport()

      if (waas.wallets.wallet) {
        // Not sure if this is right
        await Logout()
      }

      const wallet = await waas.wallets.restoreFromBackup(backupData)

      this._currentAddress = await wallet.addresses.for(ProtocolFamily.EVM)

      const withViemAccount = await this.withAccount(wallet)
      return withViemAccount
    } catch (error) {
      console.error(error)
      throw new Error("Failed to restore wallet")
    }
  }

  async getAllEvmAddresses() {
    const { ProtocolFamily } = await cwaasImport()
    const waas = await this.getProvider()

    const allAddresses =
      (await waas.wallets.wallet.addresses.all()) as Address<ProtocolFamily>[]

    const evmAddresses = allAddresses.filter(
      (address) => address.protocolFamily === ProtocolFamily.EVM
    )

    return evmAddresses
  }
}
